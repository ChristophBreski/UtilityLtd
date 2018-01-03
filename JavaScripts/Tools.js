//----------------------------------------------------------------------------------------------------------------------
// Transfers a Number in a String and add dots
function makePrettyNumber(number) {
    var temp_str = number.toString();
    var pretty_number = "";
    var points_to_add = 0;

    if(temp_str.length > 3)
        if(temp_str.length % 3 == 0)
            points_to_add = Math.floor(temp_str.length / 3) - 1;
        else
            points_to_add = Math.floor(temp_str.length / 3);
    else
        return  temp_str;

    var start = 0;
    var end = temp_str.length - points_to_add * 3;

    if(start == end)
        pretty_number = temp_str.charAt(start);
    else
        pretty_number = temp_str.substring(start,end);
    pretty_number = pretty_number.concat(".");
    start = end;
    end = end + 3;
    pretty_number = pretty_number.concat(temp_str.substring(start, end));
    for(counter_ponits = 1; counter_ponits < points_to_add; counter_ponits++) {
        pretty_number = pretty_number.concat(".");
        start = end;
        end = end + 3;
        pretty_number = pretty_number.concat(temp_str.substring(start, end));
    }
    start = end;
    end = end + 3;
    pretty_number = pretty_number.concat(temp_str.substring(start, end));

    return pretty_number;
}