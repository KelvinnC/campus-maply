import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

export default function CreateEventForm({ onEventCreated }) {
    const { register, handleSubmit, reset, watch } = useForm();
    const loggedIn = JSON.parse(localStorage.getItem("user"));
    const isFaculty = loggedIn.status === "FACULTY";
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);

    const watchDate = watch('date');
    const watchStartTime = watch('startTime');
    const watchEndTime = watch('endTime');

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            if (!watchDate || !watchStartTime || !watchEndTime) {
                setAvailableRooms([]);
                return;
            }

            try {
                setLoadingRooms(true);
                const startDateTime = new Date(`${watchDate}T${watchStartTime}`);
                const endDateTime = new Date(`${watchDate}T${watchEndTime}`);

                if (endDateTime <= startDateTime) {
                    setAvailableRooms([]);
                    return;
                }

                const response = await fetch(
                    `/api/rooms/available?start=${startDateTime.toISOString()}&end=${endDateTime.toISOString()}&isFaculty=${isFaculty}&userId=${loggedIn.id}`
                );

                if (response.ok) {
                    const rooms = await response.json();
                    setAvailableRooms(rooms);
                } else {
                    console.error('Failed to fetch available rooms');
                    setAvailableRooms([]);
                }
            } catch (error) {
                console.error('Error fetching available rooms:', error);
                setAvailableRooms([]);
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchAvailableRooms();
    }, [watchDate, watchStartTime, watchEndTime]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessage('');
        setIsSuccess(false);

        try {
            const startDateTime = new Date(`${data.date}T${data.startTime}`);
            const endDateTime = new Date(`${data.date}T${data.endTime}`);

            if (endDateTime <= startDateTime) {
                setMessage('End time must be after start time');
                setIsSuccess(false);
                setIsLoading(false);
                return;
            }

            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            const payload = {
                title: data.title,
                description: data.description || null,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                created_by: user?.id || null,
                room_id: data.roomId ? parseInt(data.roomId) : null,
            };

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage('Event created successfully!');
                reset(); 
                
                if (onEventCreated) {
                    onEventCreated(result);
                }

                setTimeout(() => {
                    setMessage('');
                    setIsSuccess(false);
                }, 3000);
            } else {
                setIsSuccess(false);
                setMessage(result.error || 'Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            setIsSuccess(false);
            setMessage('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="createEventForm">
            <h1>Create A New Event</h1>
            
            <label>Title *</label>     
            <input 
                type="text" 
                {...register("title", { required: true })}
                required
            />

            <label>Description</label>     
            <textarea 
                {...register("description")}
                rows="3"
            />

            <label>Date *</label>
            <input 
                type="date" 
                {...register("date", { required: true })}
                required
            />

            <label>Start Time *</label>
            <input 
                type="time" 
                {...register("startTime", { required: true })}
                required
            />

            <label>End Time *</label>
            <input 
                type="time" 
                {...register("endTime", { required: true })}
                required
            />

            <label>Room Location (Optional)</label>
            <select {...register("roomId")} disabled={loadingRooms}>
                <option value="">
                    {!watchDate || !watchStartTime || !watchEndTime 
                        ? 'Select date and times first' 
                        : loadingRooms 
                        ? 'Loading available rooms...' 
                        : availableRooms.length === 0 
                        ? 'No rooms available for this time' 
                        : 'No room booking'}
                </option>
                {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                        {room.building_code || 'UNK'} : {room.room_number} - Capacity: {room.capacity}
                    </option>
                ))}
            </select>
            {!watchDate || !watchStartTime || !watchEndTime ? (
                <small style={{ color: '#6D94C5', fontSize: '0.9em' }}>
                    Fill in date and time to see available rooms
                </small>
            ) : availableRooms.length > 0 ? (
                <small style={{ color: '#28a745', fontSize: '0.9em' }}>
                    {availableRooms.length} room(s) available
                </small>
            ) : !loadingRooms ? (
                <small style={{ color: '#dc3545', fontSize: '0.9em' }}>
                    No rooms available for selected time
                </small>
            ) : null}

            {message && (
                <div style={{ 
                    padding: '10px', 
                    marginTop: '10px',
                    borderRadius: '4px',
                    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
                    color: isSuccess ? '#155724' : '#721c24',
                    border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message}
                </div>
            )}
                    
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Event'}
            </button>
                
        </form>
    );
}
