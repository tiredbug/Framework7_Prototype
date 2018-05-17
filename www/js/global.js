/**
 * Created by Jason on 5/14/2018.
 */
function checkEmail(email) {
    var regex = new RegExp(/\S+@\S+\.com/);
    if (regex.test(email))
        return true;
    else return false;
}
