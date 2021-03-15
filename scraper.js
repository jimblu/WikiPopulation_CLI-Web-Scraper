const cheerio = require('cheerio');
const fetch = require('node-fetch');
const readline = require("readline");

const pageUrl = 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population';


const main = async () => {

    
    const getCountry = async () => {
        const countries = [];
        try{
            const data = await fetch(pageUrl);
            const $ = cheerio.load(await data.text());
            const table = $('#mw-content-text > div.mw-parser-output > table');
            table.find('tbody tr').slice(1, 242).each((i, element) => {
                $element = $(element);
                country = {};
                country.name = $($element.find('td a')[0]).text().trim();
                country.population = $($element.find('td')[1]).text().trim();
                country.percentageOfWorld = $($element.find('td')[2]).text().trim();
                country.date = $($element.find('td')[3]).text().trim();
                countries.push(country); 
            });
        } catch (err) {
            console.log(err);
        }
        return countries;
    }
    
    const countries = await getCountry();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const interface = () => {
        console.clear();
        rl.question("Wanna know if there are many more of us today? \n", (res) => {
            if (res === 'yes' || res === 'y' || res === 'Y' || res === 'Yes' || res === 'YES' || res === 'oui' || res === 'OUI' || res === 'Oui') {
                const resTreatment = () => {
                rl.question("Select a country !\n", (res) => {
                    const choice = res.toLocaleLowerCase().split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
                    const resCheck = countries.find(word => word.name === choice);
                    if (resCheck) {
                        console.log(resCheck);
                        rl.question("Another one ?\n", (res) => {
                            if (res === 'yes' || res === 'y' || res === 'Y' || res === 'Yes' || res === 'YES' || res === 'oui' || res === 'OUI' || res === 'Oui') {
                                resTreatment();
                            } else {
                                rl.close();
                            }
                        });
                    } else {
                        console.log("Sorry I did not understand !");
                        resTreatment();
                    }
                }); 
                };
                resTreatment();
            } else if (res === 'no' || res === 'No' || res === 'NO' || res === 'nO' || res === 'non' || res ==='Non' || res === 'n' || res === 'N') {
                    console.log('Ok bye !')
                    rl.close();
                } else {
                    console.log(`Sorry I did not understand ${res}! Try yes/no or y/n... `);
                    interface();
            }
        }); 
    }
    interface();
}
main();
