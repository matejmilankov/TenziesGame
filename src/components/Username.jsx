import '../Username.css'

export function Username({ handleUsernameSubmit }) {

    const submitUsername = (formData) => {
        const username = formData.get("username");
        handleUsernameSubmit(username);
    }

    return(
        <div className='username-wraper'>
            <div>
                <h1 className="title">Welcome to Tenzis</h1>
                <p className="instructions">Enter your username so you can be placed at leaderboard</p>
                <form action={submitUsername}>
                    <input type="text" name="username" required/>
                    <button>Start</button>
                </form>
            </div>
        </div>
    );
}