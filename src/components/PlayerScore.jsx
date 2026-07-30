export function PlayerScore({ score, rank }) {
    return(
        <div className="player-score">
            <p>{rank}</p>
            <p className="player-username">{score.username}</p>
            <p>{score.time}</p>
            <p>{score.rolls}</p>
        </div>
    );
}