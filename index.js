document.addEventListener("DOMContentLoaded", () => {

    let form = document.getElementById("form")
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(e.target.input.value)
        filter(e.target.input.value)
    })

    let globalData
    let container = document.getElementById("container")

    fetch(`https://developer.nps.gov/api/v1/parks?api_key=1A1ysntfoonKKUeUWGZEkhfdQacwcXmb9kedUFy4`)
    .then((response) => response.json())
    .then((json) => { 
        console.log(json)
        console.log(json.data[0].states)
        console.log(json.data[0].entranceFees)
        console.log(json.data[0].operatingHours)
        console.log(json.data[0].activities[0].name)
        console.log(json.data[0].fullName)
        console.log(json.data[0].images)
        console.log(json.data[0].images[0].url)
        console.log(json.data[0])
        console.log(json.data)
        globalData = json.data
        // globalData.forEach((park) => createCard(park))
})


    function filter(data) {
        container.innerHTML = ' '
        console.log(data)
        console.log(globalData)
        let parks = globalData.filter((park) => park.states == data)
        console.log(parks)
        parks.forEach((park) => createCard(park))
    }

 function createCard(park) {
   

    let card = document.createElement("div")
    card.className = "card"
    card.id = "card"
    card.innerHTML = `
    <img id="cardimage" src="${park.images[0].url}" class="card-img-top" alt="card">
                <i class="fa-regular fa-star"></i>
                <div class="card-body">
                    <h5 class="card-title">${park.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${park.states}</h6>
                    <p class="card-text">"this is a park"</p>
                </div>
    
    `
    // let container = document.getElementById("container")
     container.appendChild(card)
   
 }
















})