export default {
	myFunction(arr) {
    var mySalt = "salt=xinbibangymb";
    var myChannelType = "channelType=h5";
    arr.push(mySalt);
    arr.push(myChannelType);
    arr.sort();
    var arrFirstValue = arr[0];
    var arrSplicing = "";
    for (var i = 1; i < arr.length; i++) {
      arrSplicing = arrSplicing + "&" + arr[i];
    }
    var AllArrSplicing = arrFirstValue + arrSplicing;
    return AllArrSplicing + "&893c9a11b5a6cd4d9d8531ab2dc7w37a";
  },
  myUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";

    var uuid = s.join("");
    return uuid;
  }

}