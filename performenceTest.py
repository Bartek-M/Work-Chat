from locust import HttpUser, task, between

class DjangoUserBehavior(HttpUser):
    wait_time = between(1, 5)  # Simulates a wait time between actions of 1 to 5 seconds.

    @task
    def view_home_page(self):
        self.client.get("/")

for _ in range(1000):
    wait()
    DjangoUserBehavior.view_home_page()