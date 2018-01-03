//----------------------------------------------------------------------------------------------------------------------
// Variables
//      - results -> Stores the Result for Each Player
//      - player_names -> Hold the Discord Names of the Players
//      - ice_types -> Hold the ICE Types in EvE
//      - ice_ammount -> Hold the Information of how much Ice was minered from one type
//      - ice_prices -> Hold the Information how much the Corp pays for an ice type
//      - shift_chars -> Holds the informationen for the parser how much chars he has to move when he found an Ice Type
var results = new Array();
var player_names = new Array("Kuschy Redeye", "nasi", "Sibelius Ronkhar", "Salvador", "Tormag Goldhand", "Zeez Exus",
    "Atlas", "Johann", "Edgar", "Kim Nocre", "Klausnn Olacar", "Korhal Schwarz", "Mel'o'Dram", "Steve Gantera",
    "D`orlosBuddlobert");
var ice_types = new Array("Thick Blue Ice", "Dark Glitter", "Glare Crust", "Gelidus", "Krystallos");
var bonus_tasks = new Array("Hauler", "Booster");
var ice_ammount = new Array(0,0,0,0,0);
var shift_chars = new Array(18,16,11,15,14);
var ice_prices = new Array(300000, 450000, 630000, 360000, 500000);
var average_isk_block = 0;
var total_mining_amount = 0;
var total_isk_amount = 0;

//----------------------------------------------------------------------------------------------------------------------
// Event Listner which just waits until the User Press the "Senden" Button
var button_analyse = document.getElementById("analyse")
if(button_analyse != null)
    button_analyse.addEventListener("click", function() {createUserResult("MiningLedger")});

//----------------------------------------------------------------------------------------------------------------------
// This Function is the Controller for the new View
function createUserResult(id) {
    parseInput(id);

    deleteElementById("input");

    var headline_total = document.createElement("div");
    headline_total.appendChild(document.createTextNode("Gesamtübersicht Mining OP"));
    document.getElementById("content").appendChild(headline_total);
    document.getElementById("content").appendChild(document.createElement("br"));

    createTableTotal(total_isk_amount, total_mining_amount, average_isk_block);

    var headline_player = document.createElement("div");
    headline_player.appendChild(document.createTextNode("Spielerübersicht"));
    document.getElementById("content").appendChild(headline_player);
    document.getElementById("content").appendChild(document.createElement("br"));

    createTablePlayer();

    console.log(results);
}

//----------------------------------------------------------------------------------------------------------------------
// This Function Parse the Input to get the Informations Mining Amount in Total and Mining Ammount for each player
// After this it calls functions wich create the Output for the User
function parseInput(id) {
    var text = document.getElementById(id).value;
    var text_lines = text.split(" - ");
    var current_player = " ";

    for(counter_lines = 0; counter_lines < text_lines.length-1;) {

        mining_amount = 0;

        for (counter_players = 0; counter_players < player_names.length; counter_players++) {
            if (text_lines[counter_lines].indexOf(player_names[counter_players]) != -1)
                current_player = player_names[counter_players];
        }

        counter_lines++;

        for(counter_ice = 0; counter_ice < ice_types.length; counter_ice++) {
            var start = 0;
            while(true) {
                start = text_lines[counter_lines].indexOf(ice_types[counter_ice], start)
                if (start == -1)
                    break;

                start  = start + shift_chars[counter_ice];

                var end = text_lines.indexOf(" ", start)
                var current_amount = parseInt(text_lines[counter_lines].slice(start, end));
                mining_amount = mining_amount + current_amount;

                ice_ammount[counter_ice] = ice_ammount[counter_ice] + current_amount;
            }
        }

        results.push({
            PlayerName: current_player,
            MiningAmount: mining_amount,
            ISK: 0,
            Hauler: "no",
            Booster: "no"
        });
    }

    for (counter_ice = 0; counter_ice < ice_ammount.length; counter_ice++) {
        total_mining_amount = ice_ammount[counter_ice] + total_mining_amount;
        total_isk_amount = ice_ammount[counter_ice] * ice_prices[counter_ice] + total_isk_amount;
    }

    var average_isk_block = total_isk_amount / total_mining_amount;

    for(counter_results = 0; counter_results < results.length; counter_results++) {
        results[counter_results].ISK = results[counter_results].MiningAmount * average_isk_block;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// This Function Deletes the Element with the given HTML ID
function deleteElementById(id) {
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

//----------------------------------------------------------------------------------------------------------------------
// Creates the HTML Table with the Total Amount of the Mining Event
function createTableTotal(total_isk_amount, total_mining_amount, average_isk_block) {
    var table = document.createElement("div");
    table.className = "table";

    // Creates Table Header
    var tableheader = new Array("ICE Sorte", "Menge", "ISK Gesamt", "ISK pro Block")
    var line = document.createElement("div");
    line.className = "tr";
    for(counter_rows = 0; counter_rows < tableheader.length; counter_rows++) {
        var row = document.createElement("div");
        row.className = "th";
        row.appendChild(document.createTextNode(tableheader[counter_rows]))
        line.appendChild(row);
    }
    table.appendChild(line);

    // Creates Table Rows
    for(counter_ice = 0; counter_ice < ice_types.length; counter_ice++) {
        line = document.createElement("div");
        line.className = "tr"
        for(counter_rows = 0; counter_rows < tableheader.length; counter_rows++) {
            var row = document.createElement("div");
            if(counter_rows == 0) {
                row.className = "td";
                row.appendChild(document.createTextNode(ice_types[counter_ice]));
            }
            else if(counter_rows == 1) {
                row.className = "tdnumber";
                row.appendChild(document.createTextNode(makePrettyNumber(ice_ammount[counter_ice])));
            }
            else if(counter_rows == 2) {
                row.className ="tdnumber";
                row.appendChild(document.createTextNode(makePrettyNumber(ice_prices[counter_ice] * ice_ammount[counter_ice])));
            }
            else if(counter_rows == 3) {
                row.className ="tdnumber";
                row.appendChild(document.createTextNode(makePrettyNumber(ice_prices[counter_ice])));
            }
            line.appendChild(row);
        }
        table.appendChild(line);
    }

    // Create Total Line
    line = document.createElement("div");
    line.className = "tr";
    for(counter_rows = 0; counter_rows < tableheader.length; counter_rows++) {
        var row = document.createElement("div");
        if(counter_rows == 0) {
            row.className = "tdgesamt";
            row.appendChild(document.createTextNode("Gesamt"));
        }
        else if(counter_rows == 1) {
            row.className = "tdgesamtnumber";
            row.appendChild(document.createTextNode(makePrettyNumber(total_mining_amount)));
        }
        else if(counter_rows == 2) {
            row.className ="tdgesamtnumber";
            row.appendChild(document.createTextNode(makePrettyNumber(total_isk_amount)));
        }
        else if(counter_rows == 3) {
            row.className ="tdgesamtnumber";
            row.appendChild(document.createTextNode(makePrettyNumber(average_isk_block)));
        }
        line.appendChild(row);
    }

    table.appendChild(line);

    document.getElementById("content").appendChild(table);
    document.getElementById("content").appendChild(document.createElement("br"));
}

//----------------------------------------------------------------------------------------------------------------------
// Creates the HTML Table with the Player information for the Mining Event
function createTablePlayer() {
    var table = document.createElement("div");
    table.className = "table";

    // Create Table Header
    var tableheader = new Array("Name", "Amount", "ISK", "Hauler", "Booster");
    var lines = document.createElement("div");
    lines.className = "tr";

    for (counter_rows = 0; counter_rows < tableheader.length; counter_rows++) {
        var row = document.createElement("div");
        row.className = "th";
        row.appendChild(document.createTextNode(tableheader[counter_rows]));
        lines.appendChild(row);
    }
    table.appendChild(lines);

    // Create Table Content
    for(counter_lines = 0; counter_lines < results.length; counter_lines++) {
        lines = document.createElement("div");
        lines.className = "tr";
        for(var key in results[counter_lines]) {
            var row = document.createElement("div");
            var value = results[counter_lines][key];

            if(key == "PlayerName") {
                row.className = "td";
                row.appendChild(document.createTextNode(value));
            }
            else if(key == "Hauler" || key =="Booster") {
                row.className = "tdrighttext";
                row.appendChild(document.createTextNode(value));
            }
            else{
                row.className = "tdnumber";
                row.appendChild(document.createTextNode(makePrettyNumber(value)));
            }
            lines.appendChild(row);
        }
        table.append(lines);
    }

    document.getElementById("content").appendChild(table);
}