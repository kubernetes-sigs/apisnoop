import csv
import datetime
import json
import uuid
from faker import Faker

fake = Faker()
MAX_RANGE = 1000000
datetime_end = datetime.datetime.now()
datetime_start = datetime_end - datetime.timedelta(days=365)

# geneate JSON
with open('data.json', 'w') as f:
    for i in range(0, MAX_RANGE):
        f.write(json.dumps({
            'id': str(uuid.uuid4()),
            'author': fake.name(),
            'content': fake.sentence(nb_words=16, variable_nb_words=True),
            'source': fake.company(),
            'published_at': fake.date_time_between_dates(
                datetime_start=datetime_start,
                datetime_end=datetime_end,
            ).isoformat()
        }) + "\n")
