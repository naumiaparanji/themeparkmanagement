"""
Script to generate random junk data in the database
WILL DELETE ALL CURRENT DATA!

needs:
mysql-connector-python
pynacl
"""
import base64
import json
import random
from datetime import datetime
import mysql.connector
import nacl.utils
import nacl.pwhash


def gen_names(num_names):
    with open('names.json') as f:
        n_list = json.load(f)
    max_names = (len(n_list['maleFirstNames']) + len(n_list['femaleFirstNames'])) * len(n_list['lastNames'])
    num_names = max(min(num_names, max_names), 1)
    names = set()
    while len(names) < num_names:
        if random.randint(0, 1):
            f_name = random.choice(n_list['maleFirstNames'])
        else:
            f_name = random.choice(n_list['femaleFirstNames'])
        names.add((f_name, random.choice(n_list['lastNames'])))
    return names


def rand_time():
    return (f'{random.randrange(0, 24):02d}:'
            f'{random.randrange(0, 59):02d}:'
            f'{random.randrange(0, 59):02d}')


def gen_products(num_products, min_price=10, max_price=100, inventory_min=1000, inventory_max=10000):
    return [(
        f'Product{i}',
        'NO IMAGE',
        random.randrange(min_price * 100, max_price * 100) / 100,
        'Not a real product',
        random.randrange(inventory_min, inventory_max),
        f'fake-{i + 1:05d}-nr',
        f'{random.randint(0, 999999999999):012d}'
    ) for i in range(num_products)]


def gen_rides():
    # chatgpt names
    ride_names = [
        "Thunderbolt Twister",
        "Skyhawk Soar",
        "Cyclone Surge",
        "Galactic Spin",
        "Inferno Drop",
        "Phantom Plunge",
        "Avalanche Run",
        "Vortex Vibe",
        "Gravity Grinder",
        "Serpent Strike"
    ]

    # chatgpt categories
    ride_categories = [
        "Roller Coasters",
        "Water Rides",
        "Thrill Rides",
        "Family Rides",
        "Kiddie Rides",
        "Dark Rides",
        "Flat Rides",
        "Drop Towers",
        "Spinning Rides",
        "Swing Rides"
    ]

    return [(
        name,
        random.choice(ride_categories),
        datetime.today().strftime('%Y-%m-%d'),
        7,
        rand_time(),
        random.randrange(16, 80)
    ) for name in ride_names]


def get_mcf_str(algo, ops, mem, salt, key):
    encoded_salt = base64.b64encode(salt)
    encoded_key = base64.b64encode(key)
    return f'${algo}${ops}${mem}${encoded_salt.decode("utf-8")}${encoded_key.decode("utf-8")}'


def rand_pass():
    # Libsodium has all the popular new hashing algos, including Scrypt and Argon2
    # see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html for pw store recommendations
    # and https://libsodium.gitbook.io/doc/password_hashing#server-relief for how to reduce compute costs on the server
    # argon2id seems to be the recommended approach for new web apps
    salt = nacl.utils.random(nacl.pwhash.argon2id.SALTBYTES)
    key = nacl.pwhash.argon2id.kdf(32, 'password'.encode('utf-8'), salt, 2, 19 * 1024 * 1024)
    return get_mcf_str('argon2id', 2, 19, salt, key)


def gen_customers(num_customers):
    names = gen_names(num_customers)
    return [(
        f_name,
        l_name,
        f'{random.randint(1954, 2006)}-{random.randint(1, 12)}-{random.randint(1, 24)}',
        'Some Address XYZ',
        (f_name + l_name).lower() + '@mail.com',
        rand_pass(),
        datetime.today().strftime('%Y-%m-%d')
    ) for f_name, l_name in names]


def gen_employees(num_employees):
    names = gen_names(num_employees)
    return [(
        f_name,
        l_name,
        f'{random.randint(1954, 2006)}-{random.randint(1, 12)}-{random.randint(1, 24)}',
        'Some Address XYZ',
        f'{random.randint(0, 999):03d}-{random.randint(0, 999):03d}-{random.randint(0, 9999):04d}',
        (f_name + l_name).lower() + '@mail.com',
        rand_pass(),
        datetime.today().strftime('%Y-%m-%d'),
        datetime.today().strftime('%Y-%m-%d'),  # this is EndDate, which could be nullable?
        datetime.today().strftime('%Y-%m-%d')
    ) for f_name, l_name in names]


def clear_tables(cursor):
    """Must commit changes after call"""
    tables = [
        'TICKET',
        'MEMBERSHIP',
        'M_STATUS',
        'RUNS',
        'RIDE_STATUS',
        'PURCHASES',
        'SALE',
        'TRANSACTIONS',
        'CUSTOMER',
        'EMPLOYEE',
        'MAINTENANCE',
        'PRODUCT',
        'RIDES',
    ]
    for table in tables:
        cursor.execute(f'DELETE FROM {table}')
        cursor.execute(f'ALTER TABLE {table} AUTO_INCREMENT = 0')


def gen_transaction(customers, products, max_products, max_quantity):
    sold_items = set()
    num_products = random.randint(1, max_products)
    while len(sold_items) < num_products:
        prod_ref_id = random.randint(1, len(products))
        sold_items.add((products[prod_ref_id - 1], prod_ref_id))
    subtotal = 0
    sales = []
    for item in sold_items:
        quantity = random.randint(1, max_quantity)
        subtotal += quantity * item[0][2]
        sales.append((item[1], quantity))
    return (datetime.today().strftime("%Y-%m-%d"), random.randint(1, len(customers)), subtotal), sales


def main():
    # PLEASE REMOVE LOGIN INFO FROM SCRIPTS BEFORE COMMITTING TO REPOSITORY!
    db = mysql.connector.connect(
        host='192.168.1.84',
        user='admin',
        password='Ckq2Pd4VwytKZjLv',
        database='themepark_db'
    )

    cur = db.cursor()
    clear_tables(cur)

    # PRODUCT

    print("Adding products...")
    products = gen_products(100)
    cur.executemany(
        'INSERT INTO PRODUCT (name, image, currentprice, description, inventory, sku, upc) VALUES '
        '(%s, %s, %s, %s, %s, %s, %s)',
        products
    )

    # RIDES

    print("Adding rides...")
    rides = gen_rides()
    cur.executemany(
        'INSERT INTO RIDES (ridename, category, maintaindate, rideagelimit, ridehours, capacity) VALUES '
        '(%s, %s, %s, %s, %s, %s)',
        rides
    )

    # CUSTOMER

    print("Adding customers...")
    customers = gen_customers(200)
    cur.executemany(
        'INSERT INTO CUSTOMER (firstname, lastname, dob, address, email, password, created) VALUES '
        '(%s, %s, %s, %s, %s, %s, %s)',
        customers
    )

    # EMPLOYEE

    print("Adding employees...")
    employees = gen_employees(100)
    cur.executemany(
        'INSERT INTO EMPLOYEE (firstname, lastname, dob, address, phonenumber, email, password, startdate, enddate, '
        'created) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
        employees
    )

    # MAINTENANCE

    print("Creating maintenance requests...")
    m_reports = [(i + 1, f'{datetime.today().strftime("%Y-%m-%d")} {rand_time()}', 'The ride was destroyed :(')
                 for i in range(len(rides))]

    cur.executemany(
        'INSERT INTO MAINTENANCE (rideid, date, description) VALUES (%s, %s, %s)',
        m_reports
    )

    # MEMBERSHIP

    print("Creating memberships...")
    tiers = ['GOLD', 'PLAT', 'DIAM']  # from six flags
    num_memberships = len(customers) // 2
    c_ids = set()
    while len(c_ids) < num_memberships:
        c_ids.add(random.randint(1, len(customers)))
    memberships = [(random.choice(tiers), datetime.today().strftime("%Y-%m-%d"),
                    datetime.today().strftime("%Y-%m-%d"), c) for c in c_ids]

    cur.executemany(
        'INSERT INTO MEMBERSHIP (membershiptier, expirydate, purchasedate, customerid) VALUES (%s, %s, %s, %s)',
        memberships
    )

    # RIDE STATUS

    print("Populating RIDE_STATUS...")
    ride_status = [(i + 1, 'Major hurricane', 1, f'{datetime.today().strftime("%Y-%m-%d")} {rand_time()}')
                   for i in range(len(rides))]

    cur.executemany(
        'INSERT INTO RIDE_STATUS (rideid, weathercondition, status, created) VALUES (%s, %s, %s, %s)',
        ride_status
    )

    # M_STATUS
    # idk what is happening here

    print("Linking ride status and maintenance in M_STATUS (for some reason)...")
    m_status = []
    for i in range(len(ride_status)):
        for j in range(len(m_reports)):
            m_status.append((i + 1, j + 1))

    cur.executemany(
        'INSERT INTO M_STATUS (ridestatusid, maintenanceid) VALUES (%s, %s)',
        m_status
    )

    # PURCHASES

    print("Creating purchases...")
    purchases = [(i + 1, inventory, datetime.today().strftime("%Y-%m-%d"), random.randint(1, len(employees)))
                 for i, (_, _, _, _, inventory, _, _) in enumerate(products)]

    cur.executemany(
        'INSERT INTO PURCHASES (productid, quantity, purchasedate, employeeid) VALUES (%s, %s, %s, %s)',
        purchases
    )

    # RUNS

    print("Creating runs...")
    runs = [(
        random.randint(1, len(employees)),
        i + 1,
        datetime.today().strftime("%Y-%m-%d"),  # should be datetime?
        random.randint(1, capacity)
    ) for i, (_, _, _, _, _, capacity) in enumerate(rides)]

    cur.executemany(
        'INSERT INTO RUNS (employeeid, rideid, ridetime, numofriders) VALUES (%s, %s, %s, %s)',
        runs
    )

    # TRANSACTIONS and SALE

    print("Adding transactions...")
    transaction_sales = [gen_transaction(customers, products, 10, 10) for _ in range(100)]

    for i, t_s in enumerate(transaction_sales):
        cur.execute('INSERT INTO TRANSACTIONS (date, customerid, subtotal) VALUES (%s, %s, %s)', t_s[0])
        cur.executemany("INSERT INTO SALE (transactionid, productid, quantity) VALUES (%s, %s, %s)",
                        [(i + 1, p, q) for p, q in t_s[1]])

    # TICKET

    print("Adding tickets...")
    tickets = [(i + 1, 100, datetime.today().strftime("%Y-%m-%d"), datetime.today().strftime("%Y-%m-%d"),
                datetime.today().strftime("%Y-%m-%d")) for i in range(len(customers))]

    cur.executemany(
        'INSERT INTO TICKET (customerid, price, expirationdate, scanned, bought) VALUES (%s, %s, %s, %s, %s)',
        tickets
    )

    db.commit()

    print("Done.")


if __name__ == '__main__':
    main()
