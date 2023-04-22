# TODO:

[X] CHANGE FROM TOKENS IN MEMORY TO TOKENS IN DB

[X] POST ID ISNT PASSED IN URL

[X] FRONT END WORK LOL neverending "FUN!!!"

[X] ADD CREATE POST / UPDATE PASS CODE

[X] ADD SPAM RATE LIMITING

[X] ADD ABUSE FILTER FOR SLURS AND OTHER OFFENSIVE STUFF

[X] BUTTON HOVER ON MOBILE IS "NON-FUNCTIONAL" :) fixed teehee

[ ] IF UNUSED TOKEN FOR THIS IP ADDRESS EXISTS, USE THAT.

[X] test reverse proxy works w IP by banning on one device and posting on another, on the VPS (local ips are coming from the same router so same IP :// tested it w friend and it seemed to werk!!)

[X] AUTH TOKEN ALSO COMPARES IP TO INITIAL GENERATION TO STOP PPL FROM BRUTEFORCING ACTIVE TOKENS!

[X] FRONT-END REDESIGN

[X] character count does not work with some strings. it appears that tabs are being counted differently on the front end than on the back end? but they are both using the js .value method. it must be transformed as some point or formatted. 
^^^ FIXED. CHROME & FF ADD A \R TO \N IN THE POST BODY LOL. JUST USED REGEX TO STRIP IT OUT AND IT WORKS LIKE A CHARM AGAIN!! YIPPPEEE

[X] if db is empty, add test post

[X] validate message length on the back-end. shadow post if over limit

[X] footer added

-   mobile first
-   black text, off-white back
-   strong, bold text (multiple mixed together?)
-

