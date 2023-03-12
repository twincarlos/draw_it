import LZString from "../../../lz-string";

export default function Final({ game }) {

    return (
        <div className="main final">
            <h1>Final:</h1>

            {
                game.Prompts.map(prompt => (
                    <div key={prompt.id}>
                        <h2>{prompt.User.username}:</h2>
                        {
                            prompt.Tasks.sort((a, b) => a.round - b.round).map(task => (
                                <div key={task.id} style={{ backgroundColor: 'lightgray', padding: 2, border: '1px solid black' }}>
                                    {
                                        task.type === 'Draw' ?
                                        <div>
                                            <p><b>{task.User.username}:</b></p>
                                            <img alt="" src={LZString.decompressFromBase64(task.task)} /> 
                                        </div> :
                                        <p><b>{task.User.username}: </b>{ task.task }</p>
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
