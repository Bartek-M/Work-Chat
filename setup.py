import sys
import subprocess


def setup():
    # Python packages
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    # NPM packages
    subprocess.run(["npm", "install", "-g", "typescript"])
    subprocess.run(["npm", "install"])

    # APT packages
    subprocess.run(["sudo", "apt", "install", "libmagic1"])
    subprocess.run(["sudo", "apt", "install", "gunicorn"])

    # TS package
    subprocess.run(["npm", "run", "build"])

    # Database
    subprocess.run([sys.executable, "manage.py", "makemigrations api"])
    subprocess.run([sys.executable, "manage.py", "migrate"])


if __name__ == "__main__":
    setup()
