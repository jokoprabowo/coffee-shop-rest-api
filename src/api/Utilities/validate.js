module.exports = {
    validatePassword(password){
        //has at least 8 characters
        const validLength = password.length >= 8;
        
        //has at least 1 letter
        let hasLetter = false;
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        for (letter of alphabet){
            if(password.toLowerCase().includes(letter)){
                hasLetter = true;
            }
        };

        //has at least one number 
        let hasNumber = false;
        const numbers = "1234567890";
        for (number of numbers){
            if(password.includes(number)){
                hasNumber = true
            }
        };
        
        const validPassword = validLength && hasLetter && hasNumber;
        return validPassword;
    },
}