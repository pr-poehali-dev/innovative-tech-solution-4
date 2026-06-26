import os
import json
import psycopg2  # noqa


def handler(event: dict, context) -> dict:
    """Возвращает ссылку на PDF по email покупателя, если оплата прошла."""
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

    body = json.loads(event.get('body') or '{}')
    email = body.get('email', '').strip().lower()

    if not email:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'email required'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "SELECT pdf_url FROM t_p19205078_innovative_tech_solu.orders "
        "WHERE LOWER(email) = %s AND status = 'paid' "
        "ORDER BY paid_at DESC LIMIT 1",
        (email,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row or not row[0]:
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'not found'}),
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'pdf_url': row[0]}),
    }