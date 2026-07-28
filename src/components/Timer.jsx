export function Timer({ seconds }) {

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const formatedMins = mins < 10 ? `0${mins}` : mins;
        const formatedSecs = secs < 10 ? `0${secs}` : secs;
        return `${formatedMins}:${formatedSecs}`
    }

    return (
        <p>
            Timer: {formatTime(seconds)}
        </p>
    );
}