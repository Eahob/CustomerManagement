import React from 'react'

function Home(props) {
    return (
        <div id="home" className="text-white d-flex flex-column">
            <h1 className="inline-block text-center display-4 mb-4"><em>Customer Management demo</em></h1>
            <div className="mx-auto">
                <p>Here you can create new customers, search them, modify them and consult what they did</p>
                <p>You can search modify and add products or services for your customers in the top menu</p>
            </div>
            <footer class="inline-block text-center mt-auto text-secondary">
                <p>Developed by <a className="badge badge-secondary" href="https://github.com/Eahob">Eahob</a></p>
            </footer>
        </div>
    )
}

export default Home
