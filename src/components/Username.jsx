import '../Username.css'

export function Username({ handleUsernameSubmit }) {

    const submitUsername = (formData) => {
        const username = formData.get("username");
        handleUsernameSubmit(username);
    }

    return(
        <form action={submitUsername}>
            <label htmlFor="username">Enter username</label>
            <input type="text" name="username" required/>
            <button>Start</button>
        </form>
    );
}