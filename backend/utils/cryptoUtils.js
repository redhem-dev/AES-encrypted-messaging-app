const crypto = require('crypto');
const algorithm = 'aes-256-cbc';


function encrypt(text, key){
    const iv = crypto.randomBytes(16);
    const keyHashed = crypto.createHash('sha256').update(key).digest();
    let cipher = crypto.createCipheriv(algorithm, keyHashed, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

function decrypt(text, key, iv){
    iv = Buffer.from(iv, 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    const keyHashed = crypto.createHash('sha256').update(key).digest();
    let decipher = crypto.createDecipheriv(algorithm, keyHashed, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return {decryptedData: decrypted.toString()};
}

module.exports = {encrypt, decrypt};