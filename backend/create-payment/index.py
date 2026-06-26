import os
import hashlib
import json
import psycopg2


def handler(event: dict, context) -> dict:
    """Создаёт ссылку на оплату через Робокассу и сохраняет заказ в БД."""
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
    email = body.get('email', '').strip()

    login = os.environ['ROBOKASSA_LOGIN']
    password1 = os.environ['ROBOKASSA_PASSWORD1']
    amount = '535.00'
    description = 'Методичка по фондовому рынку'

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p19205078_innovative_tech_solu.orders (inv_id, email, amount, status) "
        "VALUES (nextval('t_p19205078_innovative_tech_solu.orders_id_seq'), %s, %s, 'pending') RETURNING id",
        (email or None, amount)
    )
    order_id = cur.fetchone()[0]
    cur.execute(
        "UPDATE t_p19205078_innovative_tech_solu.orders SET inv_id = %s WHERE id = %s",
        (order_id, order_id)
    )
    conn.commit()
    cur.close()
    conn.close()

    signature_str = f"{login}:{amount}:{order_id}:{password1}"
    signature = hashlib.md5(signature_str.encode()).hexdigest()

    site_url = os.environ.get('SITE_URL', 'https://p19205078.poehali.dev')
    success_url = f"{site_url}/success?Email={email}&InvId={order_id}"

    pay_url = (
        f"https://auth.robokassa.ru/Merchant/Index.aspx"
        f"?MerchantLogin={login}"
        f"&OutSum={amount}"
        f"&InvId={order_id}"
        f"&Description={description}"
        f"&SignatureValue={signature}"
        f"&Email={email}"
        f"&Culture=ru"
        f"&SuccessURL={success_url}"
    )

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': pay_url, 'inv_id': order_id}),
    }