from locust import HttpUser, task

class loscustSO1(HttpUser):
    def on_start(self):
        self.client.get("/ram")
    
    @task
    def consume_root(self):
        self.client.get("/")