document.getElementById("predictionForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    let tenth = parseFloat(document.getElementById("tenth").value);
    let twelfth = parseFloat(document.getElementById("twelfth").value);
    let cgpa = parseFloat(document.getElementById("cgpa").value);
    let communication = parseFloat(document.getElementById("communication").value);
    let projects = parseFloat(document.getElementById("projects").value);
    let internship = parseFloat(document.getElementById("internship").value);

    let b0 = -5;
    let b1 = 0.03;
    let b2 = 0.03;
    let b3 = 0.8;
    let b4 = 0.5;
    let b5 = 0.4;
    let b6 = 1.2;

    let z = b0 + (b1*tenth) + (b2*twelfth) +
            (b3*cgpa) + (b4*communication) +
            (b5*projects) + (b6*internship);

    let probability = 1 / (1 + Math.exp(-z));
    let percent = (probability * 100).toFixed(2);

    let label = probability >= 0.5 ? "Placed" : "Not Placed";

    document.getElementById("result").innerHTML =
        "Prediction: " + label + " (" + percent + "% probability)";

    new Chart(document.getElementById("chart"), {
        type: "doughnut",
        data: {
            labels: ["Placed Probability", "Not Placed"],
            datasets: [{
                data: [percent, 100 - percent]
            }]
        }
    });
});
let weights = [0,0,0,0,0,0,0]; 
let learningRate = 0.0001;
let epochs = 1000;
let trainingData = [];

function sigmoid(z){
    return 1 / (1 + Math.exp(-z));
}

function trainModel(){
    const fileInput = document.getElementById("csvFile");
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(e){
        const lines = e.target.result.split("\n");

        trainingData = [];

        for(let i=1;i<lines.length;i++){
            let row = lines[i].split(",");
            if(row.length < 7) continue;

            let x = [
                1,
                parseFloat(row[0]),
                parseFloat(row[1]),
                parseFloat(row[2]),
                parseFloat(row[3]),
                parseFloat(row[4]),
                parseFloat(row[5])
            ];
            let y = parseInt(row[6]);

            trainingData.push({x,y});
        }

        gradientDescent();
        document.getElementById("trainingStatus").innerText = 
            "Model trained successfully!";
    };

    reader.readAsText(file);
}

function gradientDescent(){
    for(let e=0;e<epochs;e++){
        for(let data of trainingData){
            let z = 0;
            for(let i=0;i<weights.length;i++){
                z += weights[i] * data.x[i];
            }

            let prediction = sigmoid(z);
            let error = prediction - data.y;

            for(let i=0;i<weights.length;i++){
                weights[i] -= learningRate * error * data.x[i];
            }
        }
    }
}
function evaluateModel(){
    let TP=0, TN=0, FP=0, FN=0;

    for(let data of trainingData){
        let z = 0;
        for(let i=0;i<weights.length;i++){
            z += weights[i] * data.x[i];
        }

        let prediction = sigmoid(z) >= 0.5 ? 1 : 0;

        if(prediction===1 && data.y===1) TP++;
        if(prediction===0 && data.y===0) TN++;
        if(prediction===1 && data.y===0) FP++;
        if(prediction===0 && data.y===1) FN++;
    }

    let accuracy = ((TP+TN)/trainingData.length)*100;

    alert("Accuracy: " + accuracy.toFixed(2) + "%\n" +
          "TP:"+TP+" TN:"+TN+" FP:"+FP+" FN:"+FN);
}
function toggleTheme(){
    document.body.classList.toggle("dark");
}
let count = localStorage.getItem("userCount") || 0;
count++;
localStorage.setItem("userCount", count);

document.body.insertAdjacentHTML("beforeend",
"<p>Total Users: "+count+"</p>");
function submitFeedback(){
    let feedback = document.getElementById("feedback").value;
    let list = JSON.parse(localStorage.getItem("feedbackList")) || [];
    list.push(feedback);
    localStorage.setItem("feedbackList", JSON.stringify(list));
    alert("Thank you for feedback!");
}
function suggestSkills(cgpa, projects, internship){
    let suggestions = [];

    if(projects < 3)
        suggestions.push("Build more real-world projects");

    if(internship == 0)
        suggestions.push("Apply for internships");

    if(cgpa < 7)
        suggestions.push("Improve core fundamentals");

    suggestions.push("Learn: Java, Data Structures, System Design");
    suggestions.push("Practice on LeetCode & CodeStudio");

    return suggestions;
}
let skills = suggestSkills(cgpa, projects, internship);
document.getElementById("result").innerHTML +=
"<br><br><b>Market Demand Suggestions:</b><br>" + skills.join("<br>");
