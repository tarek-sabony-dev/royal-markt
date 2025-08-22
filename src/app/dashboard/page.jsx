"use client";

import { useEffect, useState } from 'react';

export default function DashboardPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;
		async function load() {
			try {
				const res = await fetch('/api/orders', { cache: 'no-store' });
				if (!res.ok) throw new Error('Failed fetching orders');
				const data = await res.json();
				if (isMounted) setOrders(data.orders || []);
			} catch (e) {
				if (isMounted) setError(e.message || 'Error');
			} finally {
				if (isMounted) setLoading(false);
			}
		}
		load();
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div style={{ padding: 24 }}>
			<h1>Orders Dashboard</h1>
			{loading && <p>Loading…</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{!loading && !error && (
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr>
							<th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>ID</th>
							<th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Email</th>
							<th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Name</th>
							<th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Total</th>
							<th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Created</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((o) => (
							<tr key={o.id}>
								<td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{o.id}</td>
								<td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{o.email || o.contact_email || '-'}</td>
								<td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{o.name}</td>
								<td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{o.total_price}</td>
								<td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{o.created_at}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

