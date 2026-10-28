import React,{useState,useEffect} from 'react'
import './Style.css'

function Dashboard() {
    
    const [editId, setEditId] = useState(null);
    const [newTask, setNewTask] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTopic, setNewTopic] = useState({});
    const [newDueDate, setNewDueDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dailyGoal, setDailyGoal] = useState(() => {
    return Number(localStorage.getItem('dailyGoal')) || 3;
    });

    const [coveredTopics, setCoveredTopics] = useState(() => {
    return JSON.parse(localStorage.getItem('coveredTopics')) || [];
    });
    const [todayCompleted, setTodayCompleted] = useState(() => {
    const savedDate = localStorage.getItem('goalDate');
    const today = new Date().toDateString();

    if (savedDate === today) {
        return JSON.parse(localStorage.getItem('todayCompleted')) || [];
    }

    localStorage.setItem('goalDate', today);
    localStorage.setItem('todayCompleted', JSON.stringify([]));
    return [];
    });
    useEffect(() => {
    localStorage.setItem('coveredTopics', JSON.stringify(coveredTopics));
    }, [coveredTopics]);
    useEffect(() => {
    localStorage.setItem(
        'todayCompleted',
        JSON.stringify(todayCompleted)
    );
    localStorage.setItem('goalDate', new Date().toDateString());
    }, [todayCompleted]);
    const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem('categories')) || [
        {id:1, name:"IT & Full Stack", description:"Java, React, JavaScript, SQL", topics:["Java","React","JavaScript","SQL"], progress:60},
        {id:2, name:"Core EEE", description:"Electrical Machines, Transformers, Power Systems", topics:["Electrical Machines","Transformers","Power Systems"], progress:70}
    ];
    });
    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);
    const totalTopics = categories.reduce(
    (total, category) => total + category.topics.length,
    0
    );

    const completedCount = categories.reduce(
        (total, category) =>
            total + category.topics.filter(
                (topic) => coveredTopics.includes(topic)
            ).length,
        0
    );

    const pendingCount = totalTopics - completedCount;

    const overallProgress = totalTopics > 0
        ? Math.round((completedCount / totalTopics) * 100)
        : 0;
        const todayCount = todayCompleted.length;

    const dailyProgress = Math.min(
        Math.round((todayCount / dailyGoal) * 100),
        100
    );
        useEffect(() => {
        localStorage.setItem('dailyGoal', dailyGoal);
    }, [dailyGoal]);
    const exportTasks = () => {
    const headers = ['Task Name', 'Description', 'Topics', 'Due Date'];

    const rows = categories.map((task) => [
        task.name,
        task.description,
        task.topics.join(', '),
        task.dueDate || 'Not set'
    ]);

    const csvContent = [headers, ...rows]
        .map((row) =>
            row.map((value) =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'SkillTrack_Tasks.csv';
    link.click();

    URL.revokeObjectURL(url);
    };
    const filteredCategories = categories.filter((items) =>
    items.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <>
    
    <div className="dashboard-heading text-center">
        <h1>My Learning Dashboard</h1>
        <p>Track your learning. Build your future.</p>
    </div>
    <div className="container mb-4">
        <div className="row g-3">

        <div className="col-6 col-lg-3">
            <div className="card text-center">
                <div className="card-body">
                    <h5>Total Topics</h5>
                    <h2>{totalTopics}</h2>
                </div>
            </div>
        </div>

        <div className="col-6 col-lg-3">
            <div className="card text-center">
                <div className="card-body">
                    <h5>Completed</h5>
                    <h2>{completedCount}</h2>
                </div>
            </div>
        </div>

        <div className="col-6 col-lg-3">
            <div className="card text-center">
                <div className="card-body">
                    <h5>Pending</h5>
                    <h2>{pendingCount}</h2>
                </div>
            </div>
        </div>

        <div className="col-6 col-lg-3">
            <div className="card text-center">
                <div className="card-body">
                    <h5>Overall Progress</h5>
                    <h2>{overallProgress}%</h2>
                </div>
            </div>
        </div>

    </div>
    </div>
        <div className="container mb-4">
        <div className="card">
            <div className="card-body">
                <h4>Daily Learning Goal 🎯</h4>

                <label htmlFor="dailyGoal">
                    Topics to complete today:
                </label>

                <input
                    id="dailyGoal"
                    type="number"
                    min="1"
                    value={dailyGoal}
                    onChange={(event) =>
                        setDailyGoal(Math.max(1, Number(event.target.value)))
                    }
                />
                <p className="mt-3">
        Completed today: {todayCount} / {dailyGoal} topics
    </p>

    <div className="progress">
        <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${dailyProgress}%` }}
            aria-valuenow={dailyProgress}
            aria-valuemin="0"
            aria-valuemax="100"
        ></div>
    </div>

    <p>
        {dailyProgress >= 100
            ? "🎉 Daily goal completed!"
            : `${dailyProgress}% completed`}
    </p>
            </div>
        </div>
    </div>
        <div className="container my-3">
            <input
                type="text"
                placeholder="Enter main task name"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
            />

            <input
                type="text"
                placeholder="Enter task description"
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
            />
            <input id="dueDateInput"
        type="date"
        value={newDueDate}
        onChange={(event) => setNewDueDate(event.target.value)}
    />
        <button
            type="button"
            onClick={() => {
                if (!newTask.trim()) return;

                setCategories((previous) => [
                    ...previous,
                    {
                        id: Date.now(),
                        dueDate: newDueDate,
                        name: newTask.trim(),
                        description: newDescription.trim(),
                        topics: newDescription.split(',').map((topic) => topic.trim()).filter((topic) => topic !== ''),
                        progress: 0
                    }
                ]);

                setNewTask('');
                setNewDescription('');
                setNewDueDate('');
                document.getElementById('dueDateInput').value = '';
            }}
        >
            + Add Main Task
        </button>
    </div>

    <section>
        <div className='container'>
            <div className="search-box">
                    <span className="search-icon">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Search learning tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button type="button" onClick={exportTasks}>
                    <i className="bi bi-download"></i> Export Tasks
                </button>
            <div className='row g-3'>
                {
                filteredCategories.map((items)=>{
                    const completedCount = items.topics.filter(topic =>coveredTopics.includes(topic)).length;
                    const progress = items.topics.length > 0 ? (completedCount / items.topics.length) * 100 : 0;
                    return(
                        <div className='col-12 col-md-6' key={items.id}>
                        <div className='card'>
                            <div className='card-body'> 
                            {editId === items.id ? (
                                <>
                                    <input
                                        value={items.name}
                                        onChange={(event) => {
                                            setCategories(categories.map((category) =>
                                                category.id === items.id
                                                    ? { ...category, name: event.target.value }
                                                    : category
                                            ));
                                        }}
                                    />
                            
                                    <input
                                        value={items.description}
                                        onChange={(event) => {
                                                const description = event.target.value;

                                                setCategories((previous) =>
                                                    previous.map((category) =>
                                                        category.id === items.id
                                                            ? {
                                                                ...category,
                                                                description: description,
                                                                topics: description
                                                                    .split(',')
                                                                    .map((topic) => topic.trim())
                                                                    .filter((topic) => topic !== '')
                                                            }
                                                            : category
                                                    )
                                                );
                                            }}
                                    />
                            
                                    <button type="button" onClick={() => setEditId(null)}>
                                        Done
                                    </button>
                                    <label>Due Date:</label>
                                    <input
                                        type="date"
                                        value={items.dueDate || ''}
                                        onChange={(event) => {
                                            setCategories((previous) =>
                                                previous.map((category) =>
                                                    category.id === items.id
                                                        ? {
                                                            ...category,
                                                            dueDate: event.target.value
                                                        }
                                                        : category
                                                )
                                            );
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <h3>{items.name}</h3>
                                    <p>{items.description}</p>
                                    <p>
                                        <strong>Due Date:</strong>{' '}
                                        {items.dueDate || 'Not set'}
                                    </p>
                                    {items.dueDate &&
                                        items.dueDate <
                                            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` && (
                                            <p className="text-danger fw-bold">
                                                ⚠️ Overdue!
                                            </p>
                                        )}
                                        {items.dueDate &&
                                        items.dueDate >
                                            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` && (
                                            <p className="text-primary fw-bold">
                                                📅 Upcoming
                                            </p>
                                        )}
                                        {items.dueDate ===
                                            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` && (
                                            <p className="text-success fw-bold">
                                                📌 Due Today!
                                            </p>
                                        )}
                                    <button
                                        type="button"
                                        onClick={() => setEditId(items.id)}
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                const confirmDelete = window.confirm(
                                    'Are you sure you want to delete this task?'
                                );
                            
                                if (confirmDelete) {
                                    setCategories(categories.filter(
                                        (category) => category.id !== items.id
                                    ));
                                }
                            }}
                            >
                                Delete
                            </button>
                                <p>Progress:{Math.round(progress)}%</p>
                                <div className='progress'>
                                    <div className='progress-bar bg-primary' style={{width:`${progress}%`}}></div>
                                </div>
                                <h4>Learning Topics</h4>
                                <p>Completed Topics: {completedCount}</p>                               
                                <div className="my-2">
                                    <input
                                        type="text"
                                        placeholder="Enter a topic"
                                        value={newTopic[items.id] || ''}
                                        onChange={(event) =>
                                            setNewTopic((previous) => ({
                                                ...previous,
                                                [items.id]: event.target.value
                                            }))
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const topic = (newTopic[items.id] || '').trim();
                                        
                                            if (!topic || items.topics.includes(topic)) return;
                                        
                                            setCategories((previous) =>
                                                previous.map((category) =>
                                                    category.id === items.id
                                                        ? {
                                                            ...category,
                                                            topics: [...category.topics, topic],
                                                            description: [...category.topics, topic].join(', ')
                                                        }
                                                                                                                : category
                                                )
                                            );
                                        
                                            setNewTopic((previous) => ({
                                                ...previous,
                                                [items.id]: ''
                                            }));
                                        }}
                                    >
                                        + Add Topic
                                    </button>
                                </div>
                                <ul style={{listStyle: 'none'}}>
                                    {
                                        items.topics.map((topic)=>(
                                            <li key={topic}><input type='checkbox'
                                            checked={coveredTopics.includes(topic)}
                                            onChange={(event) => {
                                            if (event.target.checked) {
                                                setCoveredTopics(previous =>
                                                    previous.includes(topic) ? previous : [...previous, topic]
                                                );
                                            
                                                setTodayCompleted(previous =>
                                                    previous.includes(topic) ? previous : [...previous, topic]
                                                );
                                            } else {
                                                setCoveredTopics(previous =>
                                                    previous.filter(item => item !== topic)
                                                );
                                            
                                                setTodayCompleted(previous =>
                                                    previous.filter(item => item !== topic)
                                                );
                                            }
                                        }} /> {topic}
                                                    </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    );
                    })
                }
            </div>
        </div>
    </section>
      
    </>
  )
}

export default Dashboard
