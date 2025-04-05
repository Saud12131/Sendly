import React, { useCallback, useState } from 'react';
import { ReactFlow, Background, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/customnode';
import axios from "axios";
import { useNavigate } from "react-router-dom"
const leads = [
    ["saudsayyedofficial@gmail.com", "saudsayyed59@gmail.com"]
];
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const MailSchedule = [
    { label: 'After 1 Minute', value: Date.now() + 1 * MINUTE },
    { label: 'After 1 Hour', value: Date.now() + 1 * HOUR },
    { label: 'After 2 Hours', value: Date.now() + 2 * HOUR },
    { label: 'After 3 Hours', value: Date.now() + 3 * HOUR }
];
const initialNodes = [
    { id: '1', type: 'customNode', position: { x: 150, y: 100 }, data: { label: 'Add leads source', title: "Add Emails" } }
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeTypes = { customNode: CustomNode };

export default function FlowChart() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [ischedule, setIschdule] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupNodeData, setPopupNodeData] = useState(null);
    const [emails, setEmails] = useState([]);
    const [selectedEmailGroup, setSelectedEmailGroup] = useState(null);
    const [selectedScheduleTime, setSelectedScheduleTime] = useState('');
    const [templateData, setTemplateData] = useState({ title: '', subject: '', description: '' });
    const [isCreateGroupPopupVisible, setIsCreateGroupPopupVisible] = useState(false);
    const [newEmailGroup, setNewEmailGroup] = useState('');
    const [allLeads, setAllLeads] = useState(leads); // Use a separate state for leads
    const navigate = useNavigate()
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);

    const handleNodeClick = useCallback((event, node) => {
        setPopupNodeData(node.data);
        setIsPopupVisible(true);
        if (node.data.title === "Email template") {
            setTemplateData({ title: node.data.title || '', subject: node.data.subject || '', description: node.data.description || '' });
        }
    }, [setPopupNodeData, setIsPopupVisible]);

    const closePopup = () => {
        setIsPopupVisible(false);
        setPopupNodeData(null);
        setSelectedEmailGroup(null);
        setSelectedScheduleTime('');
    };

    const handleEmailGroupSelection = (event) => {
        setSelectedEmailGroup(JSON.parse(event.target.value));
    };

    const handleEmailSubmit = () => {
        if (selectedEmailGroup) {
            setEmails(selectedEmailGroup);
            const newNodeId = String(nodes.length + 1);
            const newPosition = { x: 250, y: 250 };
            const newEmailNode = {
                id: newNodeId,
                type: 'customNode',
                position: newPosition,
                data: { label: 'New Email', title: "Email template" },
            };
            setNodes((prevNodes) => [...prevNodes, newEmailNode]);
            closePopup();
            console.log(emails)
        } else {
            alert("Please select an email group.");
        }
    };

    const handleTemplateInputChange = (event) => {
        const { name, value } = event.target;
        setTemplateData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleTemplateSubmit = () => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === popupNodeData.id
                    ? { ...node, data: { ...node.data, ...templateData } }
                    : node
            )
        );
        closePopup();
    };
    const [variant, setVariant] = React.useState('dots');

    const handleScheduleButtonClick = () => {
        if (emails.length > 0 && templateData.title && templateData.subject && templateData.description) {
            setIschdule(true);
        } else {
            alert("Please select an email group and fill in the email template.");
        }
    };

    const handleScheduleTimeChange = (event) => {
        setSelectedScheduleTime(event.target.value);
    };

    const handleScheduleSubmit = async () => {
        if (selectedScheduleTime) {
            setIschdule(false);
            try {
                const res = await axios.post("http://localhost:3000/schedule-email-once",
                    {
                        emails,
                        scheduleTime: JSON.parse(selectedScheduleTime).value,
                        templateData
                    }
                );
                if (res.status >= 200 && res.status < 300) {
                    alert("Email(s) scheduled successfully");
                } else {
                    alert(`Error scheduling email(s): ${res.status}`);
                    console.error("Error response:", res);
                }
            } catch (error) {
                alert(`Error scheduling email(s): ${error.message}`);
                console.error("Axios error:", error);
            }
        } else {
            alert("Please select a schedule time.");
        }
    };

    const handleCreateGroupClick = () => {
        setIsCreateGroupPopupVisible(true);
    };

    const handleNewEmailGroupChange = (event) => {
        setNewEmailGroup(event.target.value);
    };

    const handleSaveNewEmailGroup = () => {
        if (newEmailGroup.trim() !== '') {
            const newGroup = newEmailGroup.split(',').map(email => email.trim());
            setAllLeads(prevLeads => [...prevLeads, newGroup]);
            setNewEmailGroup('');
            setIsCreateGroupPopupVisible(false);
        } else {
            alert("Please enter at least one email.");
        }
    };

    const handleCancelNewEmailGroup = () => {
        setIsCreateGroupPopupVisible(false);
        setNewEmailGroup('');
    };
    const handlelogout = () => {
        localStorage.removeItem('token')
        navigate('/signin')
    }
    return (
        <div className="relative bg-gray-100" style={{ width: '100vw', height: '100vh' }}>
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md absolute top-4 right-4 z-50'
                onClick={handleScheduleButtonClick}
            >
                Save & Schedule
            </button>
            <button className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md absolute top-4 left-4 z-50'
                onClick={handlelogout}
            >
                logout
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                className="bg-white rounded shadow-md"
                fitView
                style={{ height: '95%', width: '95%', margin: 'auto' }}
            >
                <Background variant={variant} className="bg-gray-200" />
            </ReactFlow>

            {isPopupVisible && popupNodeData && popupNodeData.title === "Add Emails" && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-xl z-1000 border border-gray-300" style={{ width: '400px' }}>
                    <button className='bg-green-500 hover:bg-green-700 text-white m-4 font-semibold py-2 px-4 rounded-xl shadow-md absolute top-1 right-4 z-50'
                        onClick={handleCreateGroupClick}
                    >
                        Create Email group
                    </button>
                    <h3 className="text-lg font-semibold mb-3">{popupNodeData.title || 'Enter Details'}</h3>
                    <div className="mb-3">
                        <select
                            value={selectedEmailGroup ? JSON.stringify(selectedEmailGroup) : ""}
                            onChange={handleEmailGroupSelection}
                            className="border border-gray-300 rounded p-2 w-full"
                        >
                            <option value="">Select an email group</option>
                            {allLeads.map((group, index) => (
                                <option key={index} value={JSON.stringify(group)}>
                                    Email Group {index + 1} ({group.length} emails)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleEmailSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                        <button
                            onClick={closePopup}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        >
                            Close
                        </button>
                    </div>
                    <div className="mt-3">
                        Selected Email Group: {selectedEmailGroup ? `[${selectedEmailGroup.join(', ')}]` : 'None'}
                    </div>
                    <div>
                        All Selected Emails: {emails.join(', ')}
                    </div>
                </div>
            )}
            {
                isPopupVisible && popupNodeData && popupNodeData.title === "Email template" && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-xl z-1000 border border-gray-300" style={{ width: '300px' }}>
                        <h3 className="text-lg font-semibold mb-3">Edit Email Template</h3>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Title:</label>
                            <input type="text" name="title" value={templateData.title} onChange={handleTemplateInputChange} className="border border-gray-300 rounded p-2 w-full" />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Subject:</label>
                            <input type="text" name="subject" value={templateData.subject} onChange={handleTemplateInputChange} className="border border-gray-300 rounded p-2 w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <textarea name="description" value={templateData.description} onChange={handleTemplateInputChange} className="border border-gray-300 rounded p-2 w-full" />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleTemplateSubmit}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                            >
                                Save
                            </button>
                            <button
                                onClick={closePopup}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            }
            {
                ischedule && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-xl z-1000 border border-gray-300" style={{ width: '300px' }}>
                        <h3 className="text-lg font-semibold mb-3">Schedule Email</h3>
                        <div className="mb-3">
                            <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-1">Schedule Time:</label>
                            <select
                                id="scheduleTime"
                                value={selectedScheduleTime}
                                onChange={handleScheduleTimeChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            >
                                <option value="">Select Schedule Time</option>
                                {MailSchedule.map((time, index) => (
                                    <option key={index} value={JSON.stringify(time)}>
                                        {time.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end mt-7">
                            <button
                                onClick={handleScheduleSubmit}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                            >
                                Schedule
                            </button>
                            <button
                                onClick={() => setIschdule(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Create Email Group Popup */}
            {isCreateGroupPopupVisible && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-xl z-2000 border border-gray-300" style={{ width: '400px' }}>
                    <h3 className="text-lg font-semibold mb-3">Create New Email Group</h3>
                    <div className="mb-3">
                        <label htmlFor="newEmailGroup" className="block text-sm font-medium text-gray-700 mb-1">Enter Emails (comma-separated):</label>
                        <textarea
                            id="newEmailGroup"
                            value={newEmailGroup}
                            onChange={handleNewEmailGroupChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSaveNewEmailGroup}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelNewEmailGroup}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
}