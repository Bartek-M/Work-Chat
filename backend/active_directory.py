from api.models import User
from ldap3 import Server, Connection, ALL, ALL_ATTRIBUTES
import os

LDAP_SERVER = os.getenv("LDAP_SERVER")
LDAP_ADMIN = os.getenv("LDAP_ADMIN")
LDAP_ADMIN_PASSWORD = os.getenv("LDAP_ADMIN_PASSWORD")
LDAP_SEARCH_BASE = os.getenv("LDAP_SEARCH_BASE")

def fetchAccounts():
    server = Server(LDAP_SERVER, get_info=ALL)
    conn = Connection(server, user=LDAP_ADMIN, password=LDAP_ADMIN_PASSWORD, authentication='SIMPLE')
    if not conn.bind():
        print('Error in bind', conn.result)
        exit()

    conn.search(LDAP_SEARCH_BASE, '(objectClass=user)', attributes=['givenName', 'sn', 'mail', 'userPrincipalName', 'physicalDeliveryOfficeName'])

    users = []
    for entry in conn.entries:
        user_dict = {
            'name': entry.givenName.value if entry.givenName else '',
            'surname': entry.sn.value if entry.sn else '',
            'email': entry.mail.value if entry.mail else '',
            'username': entry.userPrincipalName.value if entry.userPrincipalName else '',
            'title': entry.physicalDeliveryOfficeName.value if entry.physicalDeliveryOfficeName else '',
        }
        users.append(user_dict)

    # iteration for additional usage
    for user in users:
        if user.get("name") == "" and user.get("surname") == "" and user.get("username") == "":
            continue
        user["username"] = user["username"].split("@")[0]
        createUser(username=user.get("username"), email=user.get("email"), first_name=user.get("name"), last_name=user.get("surname"), job_title=user.get("title"))

    conn.unbind()

def createUser(username, email, first_name, last_name, job_title):
    User.object.create(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        job_title=job_title,
    )