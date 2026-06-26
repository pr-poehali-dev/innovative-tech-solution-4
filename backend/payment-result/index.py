import os
import hashlib
import json
import psycopg2  # noqa


def handler(event: dict, context) -> dict:
    """Обрабатывает уведомление от Робокассы об успешной оплате (ResultURL)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': '',
        }

    body_raw = event.get('body') or ''
    params = {}
    for part in body_raw.split('&'):
        if '=' in part:
            k, v = part.split('=', 1)
            params[k] = v

    out_sum = params.get('OutSum', '')
    inv_id = params.get('InvId', '')
    signature_received = params.get('SignatureValue', '').lower()

    password2 = os.environ['ROBOKASSA_PASSWORD2']
    check_str = f"{out_sum}:{inv_id}:{password2}"
    expected = hashlib.md5(check_str.encode()).hexdigest().lower()

    if signature_received != expected:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': 'bad sign',
        }

    pdf_url = os.environ.get('PDF_URL', '')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "UPDATE t_p19205078_innovative_tech_solu.orders "
        "SET status = 'paid', paid_at = NOW(), pdf_url = %s "
        "WHERE inv_id = %s",
        (pdf_url, int(inv_id))
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': f'OK{inv_id}',
    }