"""
Script to generate random junk data in the database
WILL DELETE ALL CURRENT DATA!
"""

import random
import uuid
import mysql.connector


def gen_products(num_products, min_price=10, max_price=100, inventory_min=1000, inventory_max=10000):
    return [(
        f'Product{i}',
        'NO IMAGE',
        random.randrange(min_price * 100, max_price * 100) / 100,
        'Not a real product',
        random.randrange(inventory_min, inventory_max),
        str(uuid.uuid4()),
        str(uuid.uuid4())
    ) for i in range(num_products)]


def main():
    # PLEASE REMOVE LOGIN INFO FROM SCRIPTS BEFORE COMMITTING TO REPOSITORY!
    db = mysql.connector.connect(
        host='172.18.0.2',
        user='admin',
        password='ADMIN_PASS',
        database='themepark_db'
    )

    cur = db.cursor()

    cur.execute('DELETE FROM PRODUCT')

    cur.execute('ALTER TABLE PRODUCT AUTO_INCREMENT = 0')

    cur.executemany(
        'INSERT INTO PRODUCT (name, image, currentprice, description, inventory, sku, upc) VALUES '
        '(%s, %s, %s, %s, %s, %s, %s)',
        gen_products(100)
    )

    # add stuff for other tables here

    db.commit()


if __name__ == '__main__':
    main()
