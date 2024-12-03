document.addEventListener("DOMContentLoaded", () => {

    let form = document.getElementById("form")
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        
        filter(e.target.input.value)
    })

    let globalData
    let container = document.getElementById("container")
    let parkinfo = document.getElementById("parkinfo")
    parkinfo.addEventListener("click", (e) => { 
        parkinfo.className == "hidden" ? parkinfo.className = "nothidden" : parkinfo.className = "hidden"
    })

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
        let label = document.getElementById("label")
        label.innerText = `Top parks in ${data}`
        let parks = globalData.filter((park) => park.states == data)
       parks.forEach((park) => createCard(park))
    }

 function createCard(park) {
   let card = document.createElement("div")
    card.className = "card"
    card.id = "card"
    card.innerHTML = `
    <img id="cardimage" src="${park.images[0].url}" class="card-img-top" alt="card">
                <span id="star" class="fa fa-star">&#9733</span>
                <div class="card-body">
                    <h5 class="card-title">${park.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${park.states}</h6>
                    <p class="card-text">"this is a park"</p>
                </div>
    `
    card.addEventListener("click", (e) => getCardInfo(e, park))
     container.appendChild(card)
   }


 function getCardInfo(e, park) {
    parkinfo.className = "nothidden"
    parkinfo.innerHTML = `
            <h5  id="infotitle" class="card-title">${park.name}</h5>
       <img id="infoimage" src="${park.images[0].url}"></img>
    `
    let p = document.createElement("p")
    p.id="infoactivities"
    park.activities.forEach((activity) => {
       p.innerText += activity.name
    })

    parkinfo.appendChild(p)

    let ptwo = document.createElement("p")
    ptwo.id="infohours"
    ptwo.innerText = park.weatherInfo
    parkinfo.appendChild(ptwo)
    
 }
















})