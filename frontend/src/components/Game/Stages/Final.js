import LZString from "../../../lz-string";

export default function Final({ game }) {

    return (
        <div className="main final">
            <h1>Final:</h1>

            {
                game.Prompts.map(prompt => (
                    <div key={prompt.id}>
                        <p>{prompt.User.username}:</p>
                        {
                            prompt.Tasks.map(task => (
                                <div key={task.id}>
                                    {
                                        task.type === 'Draw' ?
                                        <img alt="" src={LZString.decompress(task.task)} /> :
                                        <p>{ task.task }</p>
                                    }
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};
