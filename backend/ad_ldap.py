import os
from ldap3 import Server, Connection, ALL

from api.models import User

LDAP_SERVER = os.getenv("LDAP_SERVER")
LDAP_ADMIN = os.getenv("LDAP_ADMIN")
LDAP_ADMIN_PASSWORD = os.getenv("LDAP_ADMIN_PASSWORD")
LDAP_SEARCH_BASE = os.getenv("LDAP_SEARCH_BASE")


def fetchAccounts():
    server = Server(LDAP_SERVER, get_info=ALL)
    conn = Connection(
        server, user=LDAP_ADMIN, password=LDAP_ADMIN_PASSWORD, authentication="SIMPLE"
    )

    if not conn.bind():
        print("Error in bind", conn.result)
        return

    conn.search(
        LDAP_SEARCH_BASE,
        "(objectClass=user)",
        attributes=[
            "givenName",
            "sn",
            "mail",
            "userPrincipalName",
            "physicalDeliveryOfficeName",
        ],
    )

    users = []
    for entry in conn.entries:
        user_dict = {
            "name": entry.givenName.value if entry.givenName else "",
            "surname": entry.sn.value if entry.sn else "",
            "email": entry.mail.value if entry.mail else "",
            "username": (
                entry.userPrincipalName.value if entry.userPrincipalName else ""
            ),
            "title": (
                entry.physicalDeliveryOfficeName.value
                if entry.physicalDeliveryOfficeName
                else ""
            ),
        }
        users.append(user_dict)

    # iteration for additional usage
    for user in users:
        if (
            user.get("name") == ""
            and user.get("surname") == ""
            and user.get("username") == ""
        ):
            continue
        user["username"] = user["username"].split("@")[0]

        createUser(
            user.get("username").lower(),
            user.get("email"),
            user.get("name"),
            user.get("surname"),
            user.get("title"),
        )

    conn.unbind()


def createUser(username, email, first_name, last_name, job_title):
    try:
        User.objects.get(username=username)
    except User.DoesNotExist:
        User.object.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            job_title=job_title,
        )


try:
    fetchAccounts()
except:
    "Couldn't load Active Directory users"
