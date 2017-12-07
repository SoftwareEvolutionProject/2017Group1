class Pullrequest:
    '''
    url = ""
    number = ""
    title = ""
    key = ""
    additions = ""
    deletions = ""
    changed_files = ""
    '''
    def __init__(self):
        self.url = ""
        self.number = 0
        self.title = ""
        self.user = ""
        self.addditions = 0
        self.deletions = 0
        self.changed_files = 0
        self.commits_url = ""
        self.contributors = []

    @staticmethod
    def get_headers():
        return "url;number;title;user;additions;deletions;changed_files\n"

    def get_contributors(self):
        cbutors = ""
        for c in self.contributors:
            if len(cbutors) > 0:
                cbutors = cbutors + ", "
            cbutors = cbutors + c
        return cbutors

    def to_string(self):
        return self.url  + ";" + str(self.number) + ";" + self.title + ";" + self.get_contributors() + ";" + str(self.addditions) + ";" + str(self.deletions) + ";" + str(self.changed_files)