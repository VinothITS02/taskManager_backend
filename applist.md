# Task Manager APIs

### AuthRouter
-POST / signup
-post / login
-post / logout

### ProfileRouter
-get / profile-view
-patch / profile - update
-patch/profile-password

### ConnectionRequestRouter
-Post /request/send/interested/:userId
-Post / request/send/ignored/:userId
-post / request/review/accepted/:userId
-Post / reqeust/review/rejeced/:userId

### UserRouter
-Get /user/myConnections - Basically who has accepted my connection request
-Get /user/request/received
-Get /user/feed -Get you the users for other users on platforms

Status: Interested, ignored, accepted, rejected