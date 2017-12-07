import json
import requests
from requests.auth import HTTPBasicAuth
from Pullrequest import Pullrequest
import collections
import time
import sys
import subprocess

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
                
    setup_progress_bar("Fetching pull request data", pullrequestnr)

    # Fetching all the pull requests
    pullrequests = []

    for i in range(1, pullrequestnr+1):
    #for i in range(1, 15):
        #print "Fetching pullrequest number " + str(i);
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

        increase_progress_bar()
    finish_progress_bar()

    return pullrequests


#######################################################################
# Get data from commits.
#######################################################################
def get_commit_data(pullrequests, user, password):
    setup_progress_bar("Fetching commit data", len(pullrequests))
    for pullrequest in pullrequests:
        #if pullrequest.number == 0:
        #    continue
        
        #print "Fetching commit data for: " + str(pullrequest.number)

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
        increase_progress_bar()
    finish_progress_bar()

    return pullrequests


#######################################################################
# Progress bar
#######################################################################
def setup_progress_bar(title, width):
    print title
    sys.stdout.write("%s" % (chr(176) * width))
    sys.stdout.flush()
    sys.stdout.write("\b" * (width)) # return to start of line, after '['

def increase_progress_bar():
    sys.stdout.write(chr(219))
    sys.stdout.flush()

def finish_progress_bar():
    sys.stdout.write("\n")
    

#######################################################################
# Main
#######################################################################

#clear the screen
tmp = subprocess.call('cls', shell=True)

# Reading credentials
print "Reading credentials"
file = open("authorization.txt", "r")
user = file.readline().strip()
password = file.readline().strip()
file.close()

pullrequests = get_pull_request(user, password)
pullrequests = get_commit_data(pullrequests, user, password)

# Print data to file
file = open("output.csv", "w")
file.write(Pullrequest.get_headers())
setup_progress_bar("Saving data to file", len(pullrequests))
for r in pullrequests:
    #print "Storing request number: " + str(r.number)
    file.write(r.to_string().encode("utf-8") + "\n")
    increase_progress_bar()
    time.sleep(0.005)   # The computer is to slow for the output to console if we dont sleep a little bit
file.close()
finish_progress_bar()
