import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ticketService } from '../api/ticketService';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const resp = await ticketService.getById(id);
      setTicket(resp.data);
    } catch (error) {
      console.error("Failed to fetch ticket", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!ticket) return <div>Ticket not found.</div>;

  return (
    <div className="px-4 py-5 sm:px-6 bg-white shadow sm:rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Ticket: {ticket.category}</h3>
        <Badge color="blue">{ticket.status}</Badge>
      </div>
      <div className="mt-5 border-t border-gray-200">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Resource</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.resourceName}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.description}</dd>
          </div>
        </dl>
      </div>

      {/* Comments section would go here */}
    </div>
  );
};

export default TicketDetail;
