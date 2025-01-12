document.addEventListener("DOMContentLoaded", () => {
   let [button, form, container, parkinfo, stars, hiking, kayaking, camping, horseback] = document.querySelectorAll("#form, #stargazing, #container, #parkinfo, #parkbutton, #hiking, #camping, #kayaking, #horseback")
   let containerthree = document.getElementById("containerthree")
   let containerfour = document.getElementById("containerfour")

   button.addEventListener("click", (e) => {
    toggleParks(e)
})

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log("clicked")
        filter(e.target.input.value)
    })

    let globalData
    let state
    let elements = [stars, hiking, camping, kayaking, horseback] 
        elements.forEach(element => {
         element.addEventListener('click', (e) => {
        filterActivities(e.target.id)
            });
        });

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
        console.log(json.data[0].activities)
        console.log(json.data[0].activities[0].name)
        console.log(json.data[0].fullName)
        console.log(json.data[0].images)
        console.log(json.data[0].images[0].url)
        console.log(json.data[0])
        console.log(json.data)
        globalData = json.data
        
})


    function filter(data) {
        let contnum = 1
        console.log(data)
        state = data
        console.log(state)
        container.innerHTML = ' '
        if (data == "all") {
            globalData.forEach((park) => createCard(park, contnum))
        } else{
        // container.innerHTML = ' '
        let label = document.getElementById("label")
        label.innerText = `Top parks in ${data}`
        let parks = globalData.filter((park) => park.states == data)
       parks.forEach((park) => createCard(park, contnum))
        }
    }

 function createCard(park, contnum) {
    console.log(contnum)
    console.log(state)
    console.log(container)
    console.log(park)
   let card = document.createElement("div")
    card.className = "card"
    card.id = "card"
    card.innerHTML = `
                <div id="card-body" class="card-body">
                    <h5 class="card-title">${park.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${park.states}</h6>
                    <p class="card-text">"this is a park"</p>
                </div>
    `
    
    let image = document.createElement("img")
    image.id = "cardimage"
    image.src = `${park.images[0].url}`
    image.className = "card-img-top"
    image.addEventListener("click", (e) => getCardInfo(e, park))
    card.appendChild(image)

    let like = document.createElement("span")
    like.id = "star"
    like.className = "fa fa-star"
    like.innerHTML = "&#9733"
    like.addEventListener("click", (e) => {likedPark(e, like)})
    card.appendChild(like)
    // card.addEventListener("click", (e) => getCardInfo(e, park))
    if (contnum == 1){
     container.appendChild(card)
    } else if (contnum == 2) {
        containerthree.appendChild(card)
    } 
    
   }


 function getCardInfo(e, park) {
    console.log(state)
    console.log(park.operatingHours[0].standardHours.monday)

    let scroller = document.createElement("div")
    scroller.id = "scroll"
    scroller.className="scrollable-div"

    parkinfo.className = "nothidden"
    parkinfo.innerHTML = `
            <h5  id="infotitle" class="card-title">${park.name}</h5>
            <img id="infoimage" src="${park.images[0].url}"></img>
            <img id="infoimage2" src="${park.images[1].url}"></img>
            <img id="infoimage3" src="${park.images[2].url}"></img>
            <img id="infoimage4" src="${park.images[3].url}"></img>
    `
    let p3 = document.createElement("p")
    p3.id = "infoweather"
    p3.innerText = `Weather Info: \n ${park.weatherInfo}`

    let p2 = document.createElement("p")
    p2.id = "infohours"
    p2.innerText = ` Operating Hours: \n Monday: ${park.operatingHours[0].standardHours.monday} \n Tuesday: ${park.operatingHours[0].standardHours.tuesday} \n Wednesday: ${park.operatingHours[0].standardHours.wednesday} \n Thursday: ${park.operatingHours[0].standardHours.thursday} \n Friday: ${park.operatingHours[0].standardHours.friday}`
    
    let p = document.createElement("p")
    p.id="infoactivities"
    p.innerText = "Activities: \n"
    park.activities.forEach((activity) => {
       p.innerText += " " + activity.name + ", "
    })
    scroller.appendChild(p3)
    scroller.appendChild(p2)
     scroller.appendChild(p)
     parkinfo.appendChild(scroller)
}

 function filterActivities(data){
    console.log(data)
    containerthree.innerHTML = " "
    let contnum = 2
    let name
    switch (data) {
        case "stargazing":
            name = "Astronomy"
            break
        case "hiking":
             name = "Hiking"
             break
        case "kayaking":
             name = "Kayaking"
            break
        case "camping":
            name = "Camping"
            break
        case "horseback":
            name = "Horseback Riding"
            break
    }
   console.log(name) 
    
   let array = []
    for (let i = 0; i < globalData.length; i++) {
         for(let x = 0; x < globalData[i].activities.length; x++) {
            if (globalData[i].activities[x].name == name) {
                array.push(globalData[i])
            }
                
         }
    }
    let label = document.getElementById("label3")
    label.innerText = `Best parks for ${name}`
    console.log(array)
    array.forEach((park) => createCard(park, contnum))

}



 function likedPark(e, like) {
    console.log(e.target)
    console.log(e.target.parentNode)
    console.log("clicked")
    console.log(like)
    //  let like = document.getcontainerfourById("star")
     like.style.color = "green"
    let newcard = e.target.parentNode
    containerfour.appendChild(newcard)
   
    
 }



function toggleParks(e) {
    // console.log(e)
    console.log(containerfour.className)
    if (containerfour.classList.contains("hidden")) {
        containerfour.classList.remove("hidden");
        containerfour.classList.add("nothidden");
    } else {
        containerfour.classList.remove("nothidden");
        containerfour.classList.add("hidden");
    }
   console.log(containerfour.className)
}

let leftbutton = document.getElementById("left")
leftbutton.addEventListener("click", (e) => leftScroll())
let rightbutton = document.getElementById("right")
rightbutton.addEventListener("click", (e) => rightScroll())

function leftScroll() {
    const left = document.querySelector("#container");
    left.scrollBy(200, 0);
  }
  function rightScroll() {
    const right = document.querySelector("#container");
    right.scrollBy(-200, 0);
  }







})