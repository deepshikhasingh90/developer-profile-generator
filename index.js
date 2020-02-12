const axios = require("axios");
const util = require("util");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");
var fs = require('fs');
convertFactory = require('electron-html-to');
 
var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

const data = {}
const questions = [{
    type: "input",
    name: "username",
    message: "Enter your GitHub username: ",
    },
    {
    type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["green", "blue", "pink", "red"],
    }
];
genareteCards();
function genareteCards (){
    inquirer .prompt(questions)
    .then(function({username, color}){
        queryUrl = `https://api.github.com/users/${username}`;
        const StarredQueryUrl = `https://api.github.com/users/${username}/starred`
        axios.get(queryUrl)
            .then(function({data}){
                console.log(data);
                axios.get(StarredQueryUrl)
                    .then(function(response){
                     console.log(response);
                     const starCount =response.data.map(element => {
                        return element.stargazers_count;
                   })
                    const profileObj = {
                    stars : starCount.length,
                    username : username,
                    color : color,
                    github : data.login,
                    avatar : data.avatar_url,
                    name : data.name,
                    location : data.location,
                    bio : data.bio,
                    blog : data.blog,
                    html_url :data.html_url,
                    publicRepo : data.public_repos,
                    followers : data.followers,
                    following : data.following,
                }
                console.log(profileObj);
                var pdf = generateHTML(profileObj)
                conversion({ html: pdf }, function(err, result) {
                    if (err) {
                      return console.error(err);
                    }
                   
                    console.log(result.numberOfPages);
                    console.log(result.logs);
                    result.stream.pipe(fs.createWriteStream('./devportfolio.pdf'));
                    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                  });
            })
        })
    })
}