import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import messaging
from datetime import datetime
from datetime import timedelta
import smtplib
import ssl
import time
from email.message import EmailMessage

#Initialing the Authentication of Firebase 
def initialAuth():
    cred = credentials.Certificate("fishingtest-8c959-firebase-adminsdk-4uunj-fa9c0e110a.json")
    default_app = firebase_admin.initialize_app(cred, {'databaseURL' : 'https://fishingtest-8c959.firebaseio.com'})
    print(default_app.name)
    print(default_app.project_id)

# Check the all status of competition to return multiple lists of users and topic which include the 24hrs email notification,
# 30mins notification, result release notification.
def checkCompTime():
    compRef = db.reference('Competitions')
    compSnapshot = compRef.get() #dictionary
    notificationList = list()
    emailList = list()
    resultNotificationList = list()
    nowTime = datetime.now()
    for key, val in compSnapshot.items():
        compId = key
        compName = val['cname']
        startDate = str(val['date'])
        day, month, year = map(int, startDate.split('/'))
        startTime = str(val['startTime'])
        endTime = str(val['stopTime'])
        winner = val['winner']
        if 'attendants' in val:
            usersInComp = val['attendants']
        else:
            usersInComp = None

        if 'ifNoticed' in val:
            notificationFlag = val['ifNoticed']
        else:
            notificationFlag = None

        if 'ifResultNoticed' in val:
            resultNotificationFlag = val['ifResultNoticed']
        else:
            resultNotificationFlag = None

        # if 'ifEmailed' in val:
        #     emailFlag = val['ifEmailed']
        # else:
        #     emailFlag = None

        hour, min = map(int, startTime.split(':'))
        endhour, endmin = map(int, endTime.split(':'))
        messageBody = 'Competition {0} (id: {1}) start from {2}-{3}-{4}-{5}.'.format(compName, compId,
                                                                             day, month, year, startTime)
        print(messageBody)

        compDatetime = datetime(2000+year, month, day, hour, min, 0)
        compEndDatetime = datetime(2000+year, month, day, endhour, endmin, 0)

        nowDatetime = datetime.now()

        if usersInComp != None:
            if (notificationFlag is None or notificationFlag is False) and checkNotification(compDatetime, nowDatetime):
                notificationList.append([compId, compName])
            # if (emailFlag is None or emailFlag is False) and checkEmail(compDatetime, nowDatetime):
            if checkEmail(compDatetime, nowDatetime):
                emailList.append([compId, compName, usersInComp, messageBody])

        compStatus = checkTimePeriod(compDatetime, compEndDatetime, nowDatetime)
        if compStatus is not None:
            if compStatus == "0" or compStatus == "1":
                updateCompState(compId, compStatus)
            elif compStatus == "2":
                if winner == "NA" or winner == "":
                    updateCompState(compId, compStatus)
                else:
                    compStatus = "3"
                    if (resultNotificationFlag is None or resultNotificationFlag is False):
                        resultNotificationList.append([compId, compName, winner])
                        updateCompState(compId, compStatus)
                        print("This competition has winner: " + winner)
            elif compStatus == "3":
                if (resultNotificationFlag is None or resultNotificationFlag is False) and (winner == "NA" or winner == ""):
                    resultNotificationList.append([compId, compName, winner])
                    print("This competition has winner: " + winner)

    return notificationList, emailList, resultNotificationList

# Check whether given compeititon time is within 30 mins
def checkNotification(compDatetime, nowDatetime):
    halfhour = timedelta(minutes=30)
    zeroHour = timedelta(minutes=0)
    noticeDatetime = compDatetime - halfhour
    datetimeDifference = nowDatetime - noticeDatetime

    if zeroHour <= datetimeDifference <= halfhour:
        return True
    return False

# Check given competition start time and end time to return the status of competition
def checkTimePeriod(compDatetime, compEndDatetime, givenTime):
    if givenTime < compDatetime:
        return "0"
    elif compDatetime <= givenTime <= compEndDatetime:
        return "1"
    elif givenTime > compEndDatetime:
        return "2"
    return None

# Check whether given competition time is within 24hrs
def checkEmail(compDatetime, nowDatetime):
    oneday = timedelta(days=1)
    zeroday = timedelta(days=0)
    noticeDatetime = compDatetime - oneday
    datetimeDifference = nowDatetime - noticeDatetime

    if zeroday <= datetimeDifference <= oneday:
        return True
    return False

# Loop the 30mins notification list to invoke function of Sending the notification by given list of topic for 30mins notification
def processNotification(topicList):
    for topic in topicList:
        sendCompNotification(topic)

# Loop the result release list to invoke function of sending the notification by list of topic for result release
def processResultNotification(topicList):
    for topic in topicList:
        sendCompResultNotification(topic)

# Make the 24hrs notifcation email and invoke the sending email function
def processEmail(emailList):
    for compArray in emailList:
        compId = compArray[0]
        compName = compArray[1]
        usersArray = compArray[2]
        messageBody = compArray[3]
        for user in usersArray:
            userRef = db.reference('Users').child(user)
            thisUserCompEmailRef = userRef.child('comps_ifEmailed').child(compId)
            thisUserCompStatus = thisUserCompEmailRef.get()
            userData = userRef.get()
            useremail = userData['email']
            username = userData['displayName']
            if thisUserCompStatus is not None:
                if thisUserCompStatus == "0":
                    sendEmail(useremail, username, compId, compName, messageBody)
                    thisUserCompEmailRef.set("1")
            else:
                sendEmail(useremail, username, compId, compName, messageBody)
                thisUserCompEmailRef.set("1")

# Sending notifiaction of competition start in 30mins by given infomation of topic
def sendCompNotification(topicInfo):
    compId = topicInfo[0]
    compName = topicInfo[1]
    message = messaging.Message(
        notification=messaging.Notification(
            title='Fishing Competition Reminder',
            body='You have competition: {0} start in 30 minutes!!!'.format(compName)
        ),
        topic=compId
    )

    reseponse = messaging.send(message)

    print('Successfully sent message:' + reseponse + " for " + compName + "(" + compId + ")")

    updateNotificationStatus(compId)

# Sending notification of competition result by given infomation of topic
def sendCompResultNotification(topicInfo):
    compId = topicInfo[0]
    compName = topicInfo[1]
    winner = topicInfo[2]
    message = messaging.Message(
        notification=messaging.Notification(
            title='Fishing Competition Result Release',
            body='Competition {0} now has the winner: {1}!'.format(compName, winner)
        ),
        topic=compId
    )

    reseponse = messaging.send(message)

    print('Successfully sent result message:' + reseponse + " for " + compName + "(" + compId + ") with winner " + winner)

    updateResultNotificationStatus(compId)

# update the tag of 30mins notification has been sent
def updateNotificationStatus(compId) :
    currentCompRef = db.reference('Competitions/'+compId)
    currentCompRef.update({
        'ifNoticed': 1
    })

# update the tag of result notification has been sent
def updateResultNotificationStatus(compId) :
    currentCompRef = db.reference('Competitions/'+compId)
    currentCompRef.update({
        'ifResultNoticed': 1
    })

# update the tag of 24hrs notification email has been sent
def updateNEmailStatus(compId) :
    currentCompRef = db.reference('Competitions/'+compId)
    currentCompRef.update({
        'ifEmailed': 1
    })

# Composing the email to send
def sendEmail(userEmail, username, compId, compName, messageBody):
    smtp_server = 'smtp.gmail.com'
    port = 465
    sender_email = 'ziqiproject@gmail.com'
    password = 'ZIQI2018'
    user = 'silverkirsi@163.com' # test for
    subject = "Your have a Fishing Competition (" + compName + ") in 24 hours!"
    body = "Hi " + username + "\n" + messageBody
    message = create_email_message(sender_email, userEmail, subject, body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.send_message(message)
        print("Success Sending Email to user: " + username + " for competition: " + compName + " (" + compId + ")")

# Structuring the email by given content
def create_email_message(from_address, to_address, subject, body):
    msg = EmailMessage()
    msg['From'] = from_address
    msg['To'] = to_address
    msg['Subject'] = subject
    msg.set_content(body)
    return msg

# update the status of competition
def updateCompState(compId, status) :
    currentCompRef = db.reference('Competitions/'+compId)
    currentCompRef.update({
        'cStatus': status
    })

# main function
if __name__ == '__main__':
    initialAuth()
    # Sychonize comp attended user and user registered comp
    # usersRef = db.reference('Users')
    # users = usersRef.get()
    # compRef = db.reference('Competitions')
    #
    # comps = compRef.get()
    # myUserRigs = {}
    # for key, val in users.items():
    #     myUserRigs[key] = []
    #
    # for key, val in comps.items():
    #     if 'attendants' in val:
    #         attends = val['attendants']
    #         for user in attends:
    #             if user in myUserRigs:
    #                 myUserRigs[user].append(key)
    #             else:
    #                 myUserRigs[user] = [key]
    # for key, val in myUserRigs.items():
    #     userRef = db.reference('Users').child(key).child('comps_registered')
    #     userRef.set(val)

    while True:
        print(datetime.now())
        print("Start")
        notificationList, emailList, resultNotificationList = checkCompTime()
        if notificationList is not None:
            processNotification(notificationList)
        if emailList is not None:
            processEmail(emailList)
        if resultNotificationList is not None:
            processResultNotification(resultNotificationList)

        print("End, Run next round in 60s.")
        time.sleep(60)
