from pydantic import BaseModel


class UserAccessTokenRequest(BaseModel):
    username: str
    password: str

