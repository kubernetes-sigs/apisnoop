from pony.orm import *

__all__ = ['Endpoint', 'EndpointHit', 'commit', 'db_session', 'desc', 'count', 'select']

db = Database()


class Endpoint(db.Entity):
    method = Required(str)
    url = Required(str)
    level = Optional(str, default='')
    tags = Optional(str, default='')
    category = Optional(str, default='')
    testfile = Optional(str, default='')
    conforms = Optional(str, default='')
    questions = Optional(str, default='')
    hits = Set('EndpointHit')
    composite_key(method, url)

    @classmethod
    def get_or_create(cls, method, url):
        """
        Gets or creates an application entry

        :param method: The method to use on the endpoint
        :param url: The URL of the entity

        """
        obj = cls.get(method=method, url=url)
        if not obj:
            return cls(method=method, url=url), True
        else:
            return obj, False


class EndpointHit(db.Entity):
    endpoint = Required(Endpoint)
    user_agent = Required(str)
    PrimaryKey(endpoint, user_agent)  # ehhhhhhhhh this PK feels too big
    count = Required(int, default=0)

    @classmethod
    def get_or_create(cls, endpoint, app, user_agent):
        """
        Gets or creates a m2m relationship between an app and an endpoint
        """
        obj = cls.get(endpoint=endpoint, app=app, user_agent=user_agent)
        if not obj:
            return cls(endpoint=endpoint, app=app, user_agent=user_agent), True
        else:
            return obj, False


db.bind('sqlite', '../database.sqlite', create_db=True)
db.generate_mapping(create_tables=True)
