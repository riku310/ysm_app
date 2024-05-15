from flask import Flask, render_template, request
import datetime
import sqlite3

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/btn")
def btn_clicked():
    # id,name,time,status(0:close,1:open)
    name = request.args['name']
    status = request.args['status']

    dt = datetime.datetime.today()

    con = sqlite3.connect('sqlite.db')
    cur = con.cursor()
    cur.execute("INSERT INTO open_log(name,time,status) VALUES ('{}','{}', {})".format(name, dt, status))
    con.commit()
    con.close()
    return 'test_{}_{}'.format(name,status)
    

if __name__ == "__main__":
    app.run(debug=True)
