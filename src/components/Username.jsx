import '../Username.css'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

export function Username({ handleUsernameSubmit }) {

    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 20, duration: 1, ease: "power2.out" },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );
    }, []);

    const submitUsername = (formData) => {
        const username = formData.get("username");
        gsap.to(
            containerRef.current, {
            opacity: 0,
            x: -30,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                handleUsernameSubmit(username.trim())
            }
        });
    }

    return (
        <div className='username-wraper'>
            <div ref={containerRef}>
                <h1 className="title">Welcome to Tenzis</h1>
                <p className="instructions">Enter your username so you can be placed at leaderboard</p>
                <form action={submitUsername}>
                    <input type="text" name="username" required />
                    <button>Start</button>
                </form>
            </div>
        </div>
    );
}