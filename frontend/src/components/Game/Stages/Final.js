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
                                    <p>{task.User.username}: {task.task} type: {task.type}</p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};
