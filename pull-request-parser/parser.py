import json
import requests
from requests.auth import HTTPBasicAuth
from Pullrequest import Pullrequest
import collections
import time
import sys

##############################################################################
# Pull requests
##############################################################################
def get_pull_request(user, password):
    # Fetching number of requests.
    r = requests.get('https://api.github.com/repos/SoftwareEvolutionProject/2017Group1/pulls?state=all', auth=(user, password))

    prtext = r.text
    data = json.loads(prtext)

    pullrequestnr = -1
    for json_dict in data:
        for key,value in json_dict.iteritems():
            if key == "number":
                if value > pullrequestnr:
                    pullrequestnr = value
                
    print "We found " + str(pullrequestnr) + " pullrequests"

    # Fetching all the pull requests
    pullrequests = []

    for i in range(1, pullrequestnr+1):
    #for i in range(1, 15):
        print "Fetching pullrequest number " + str(i);
        r = requests.get('https://api.github.com/repos/SoftwareEvolutionProject/2017Group1/pulls/'+str(i), auth=(user, password))
        prtext = r.text
        data = json.loads(prtext)

        pullrequest = Pullrequest()

        for key in data:
            if key == "url":
                pullrequest.url = data[key]
            if key == "number":
                pullrequest.number = data[key]
            if key == "title":
                pullrequest.title = data[key]
            if key == "user":
                for userkey, uservalue in data[key].iteritems():
                    if userkey == "login":
                        pullrequest.user = uservalue
                        break
            if key == "additions":
                pullrequest.addditions = data[key]
            if key == "deletions":
                pullrequest.deletions = data[key]
            if key == "changed_files":
                pullrequest.changed_files = data[key]
            if key == "commits_url":
                pullrequest.commits_url = data[key]

        if pullrequest.number != 0:
            pullrequests.append(pullrequest)

    return pullrequests


#######################################################################
# Get data from commits.
#######################################################################
def get_commit_data(pullrequests, user, password):
    for pullrequest in pullrequests:
        #if pullrequest.number == 0:
        #    continue
        
        print "Fetching commit data for: " + str(pullrequest.number)

        r = requests.get(pullrequest.commits_url, auth=(user, password))
        cmtext = r.text
        data = json.loads(cmtext)
        
        for unicodeData in data:
            for key in unicodeData:
                if key == "commit":
                    for commitKey, commitData in unicodeData[key].iteritems():
                        if commitKey == "author":
                            for authorKey in commitData:
                                if authorKey == "name":
                                    contributor = commitData[authorKey]
                                    if not contributor in pullrequest.contributors:
                                        pullrequest.contributors.append(contributor)

    return pullrequests


#######################################################################
# Progress bar
#######################################################################
def setup_progress_bar(title, width):
    print title
    sys.stdout.write("[%s]" % (" " * toolbar_width))
    sys.stdout.flush()
    sys.stdout.write("\b" * (toolbar_width+1)) # return to start of line, after '['

def increase_progress_bar():
    sys.stdout.write("-")
    sys.stdout.flush()

def finish_progress_bar():
    sys.stdout.write("\n")
    

#######################################################################
# Main
#######################################################################


toolbar_width = 40
setup_progress_bar("First progress bar", toolbar_width)
for i in xrange(toolbar_width):
    time.sleep(0.1)
    increase_progress_bar()
finish_progress_bar()

setup_progress_bar("Second progress bar", toolbar_width)
for i in xrange(toolbar_width):
    time.sleep(0.1)
    increase_progress_bar()
finish_progress_bar()



'''
# Reading credentials
print "Reading credentials"
file = open("authorization.txt", "r")
user = file.readline().strip()
password = file.readline().strip()
file.close()

pullrequests = get_pull_request(user, password)
pullrequests = get_commit_data(pullrequests, user, password)

# Print data to file
" Writing to file"
file = open("output.csv", "w")
file.write(Pullrequest.get_headers())
for r in pullrequests:
    print "Storing request number: " + str(r.number)
    file.write(r.to_string().encode("utf-8") + "\n")
file.close()
'''