import psycopg2

conn = psycopg2.connect(
    dbname="capp_connect",
    user  ="capp_connect",
    password="beet-20q339-clarinet-butterfly",
    host="turing.unnamed.computer"
)
conn.autocommit = True
cursor = conn.cursor()


def insert_cont_messages_into_db():
    

