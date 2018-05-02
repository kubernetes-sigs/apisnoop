from pony.orm import *

__all__ = ['Endpoint', 'App', 'EndpointHit']

db = Database()

class Endpoint(db.Entity):
    method = Required(str)
    url = Required(str)
    level = Optional(str, default='')
    tags = Optional(str, default='')
    testfile = Optional(str, default='')
    conforms = Optional(str, default='')
    questions = Optional(str, default='')
    apps = Set('EndpointHit')
    composite_key(method, url)

    @classmethod
    def get_or_create(cls, method, url):
        """
        Gets or creates an application entry

        :param cls: The actual entity class
        :param name: Name of the application
        """
        obj = cls.get(method=method, url=url)
        if not obj:
            return cls(method=method, url=url), True
        else:
            return obj, False

    @classmethod
    def update_from_coverage(cls, method, url, **kwargs):
        """
        Gets or creates a coverage entry

        :param cls: The actual entity class
        :param method: Endpoint HTTP method
        :param url: Endpoint URL

        Optional args:
        - conformance
        - testfile
        - questions
        - tags
        """
        obj, created = cls.get_or_create(method=method, url=url)
        obj.set(**kwargs)
        return obj


class App(db.Entity):
    endpoints = Set('EndpointHit')
    name = Required(str, unique=True)

    @classmethod
    def get_or_create(cls, name):
        """
        Gets or creates an application entry

        :param cls: The actual entity class
        :param name: Name of the application
        """
        obj = cls.get(name=name)
        if not obj:
            return cls(name=name), True
        else:
            return obj, False


    def update_from_log(self, method, url, tags=None, count=0):
        endpoint, created = Endpoint.get_or_create(method, url)
        if tags:
            endpoint.tags = tags
        # commit changes before m2m query
        if tags or created:
            commit()

        hit, created = EndpointHit.get_or_create(endpoint=endpoint, app=self)
        hit.count = count
        # dont commit if we dont need to - leave it up to caller

# App - Hi
class EndpointHit(db.Entity):
    endpoint = Required(Endpoint)
    app = Required(App)
    PrimaryKey(endpoint, app)
    count = Required(int, default=0)

    @classmethod
    def get_or_create(cls, endpoint, app):
        """
        Gets or creates a m2m relationship between an app and an endpoint
        """
        obj = cls.get(endpoint=endpoint, app=app)
        if not obj:
            return cls(endpoint=endpoint, app=app), True
        else:
            return obj, False


db.bind('sqlite', '../conformance.sqlite', create_db=True)
db.generate_mapping(create_tables=True)
