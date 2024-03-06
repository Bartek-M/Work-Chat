import os
import threading

from ldap3 import Server, Connection, ALL

from api.models import User

LDAP_SERVER = os.getenv("LDAP_SERVER")
LDAP_ADMIN = os.getenv("LDAP_ADMIN")
LDAP_ADMIN_PASSWORD = os.getenv("LDAP_ADMIN_PASSWORD")
LDAP_SEARCH_BASE = os.getenv("LDAP_SEARCH_BASE")


def fetch_accounts():
    try:
        server = Server(LDAP_SERVER, get_info=ALL)
        conn = Connection(
            server,
            user=LDAP_ADMIN,
            password=LDAP_ADMIN_PASSWORD,
            authentication="SIMPLE",
        )

        if not conn.bind():
            print("[INFO] Error in AD bind: ", conn.result)
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

        users = [
            {
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
            for entry in conn.entries
        ]

        # iteration for additional usage
        for user in users:
            if (
                user.get("name") == ""
                and user.get("surname") == ""
                and user.get("username") == ""
            ):
                continue

            create_user(
                user["username"].split("@")[0].lower(),
                user.get("email"),
                user.get("name"),
                user.get("surname"),
                user.get("title"),
            )

        print("[INFO] Loaded Active Directory users")
        conn.unbind()
    except:
        pass


def create_user(username, email, first_name, last_name, job_title):
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


thread = threading.Thread(target=fetch_accounts)
thread.start()
thread.join(timeout=10)

if thread.is_alive():
    print("[INFO] Couldn't load Active Directory users")