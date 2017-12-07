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

    '''
    def __init__(self, url, number, user, key, additions, deletions, changed_files):
        self.url = url
        self.number = number
        self.user = user
        self.key = key
        self.addditions = additions
        self.deletions = deletions
        self.changed_files = changed_files
    '''
    def to_string(self):
        return self.url  + "\n" + str(self.number) + "\n" + self.title + "\n" + self.user + "\n" + str(self.addditions) + "\n" + str(self.deletions) + "\n" + str(self.changed_files)
