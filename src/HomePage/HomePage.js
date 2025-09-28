// import React from 'react';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

function HomePage() {
    const [budgetData, setBudgetData] = useState([]);
    const chartRef = useRef(null);
  
    useEffect(() => {
        axios.get('http://localhost:3001/budget')
        .then(response => {
            setBudgetData(response.data.myBudget);
            drawChartJS(response.data.myBudget);
            drawD3(response.data.myBudget);
        })
        .catch(error => {
          console.error('Error fetching budget data:', error);
        });
    }, []);
  
    const drawChartJS = (data) => {
      const ctx = document.getElementById('myChart');
      if (!ctx) return;

      if (chartRef.current) {
        chartRef.current.destroy();
    }
  
      const dataSource = {
        datasets: [{
          data: data.map(item => item.budget),
          backgroundColor: [
            '#ffcd56','#ff6384','#36a2eb','#fd6b19','#4bc0c0','#9966ff','#c9cbcf'
          ]
        }],
        labels: data.map(item => item.title)
      };
  
      new Chart(ctx, {
        type: 'pie',
        data: dataSource,
      });
    };
  
    const drawD3 = (data) => {
      const width = 960;
      const height = 450;
      const radius = Math.min(width, height) / 2;
  
      // Clear previous chart
      d3.select('#d3Chart').selectAll('*').remove();
  
      const svg = d3.select('#d3Chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2}, ${height/2})`);
  
      const pie = d3.pie().value(d => d.budget);
      const arc = d3.arc().innerRadius(radius*0.4).outerRadius(radius*0.8);
      const outerArc = d3.arc().innerRadius(radius*0.9).outerRadius(radius*0.9);
  
      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.title))
        .range(['#ffcd56','#ff6384','#36a2eb','#fd6b19','#4bc0c0','#9966ff','#c9cbcf']);
  
      const key = d => d.data.title;
  
      const midAngle = d => d.startAngle + (d.endAngle - d.startAngle)/2;
  
      // Draw slices
      const slice = svg.selectAll('path.slice')
        .data(pie(data), key);
  
      slice.enter()
        .append('path')
        .attr('class', 'slice')
        .style('fill', d => color(d.data.title))
        .merge(slice)
        .transition().duration(1000)
        .attrTween('d', function(d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return t => arc(interpolate(t));
        });
  
      slice.exit().remove();
  
      // Draw labels
      const text = svg.selectAll('text')
        .data(pie(data), key);
  
      text.enter()
        .append('text')
        .attr('dy', '.35em')
        .text(d => d.data.title)
        .merge(text)
        .transition().duration(1000)
        .attrTween('transform', function(d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return t => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween('text-anchor', function(d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          return t => {
            const d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? 'start' : 'end';
          };
        });
  
      text.exit().remove();
  
      // Draw polylines
      const polyline = svg.selectAll('polyline')
        .data(pie(data), key);
  
      polyline.enter()
        .append('polyline')
        .merge(polyline)
        .transition().duration(1000)
        .attrTween('points', function(d){
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return t => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });
  
      polyline.exit().remove();
  
      // Randomize button
      d3.select('.randomize').on('click', () => {
        const newData = data.map(item => ({
          title: item.title,
          budget: Math.random() * item.budget
        }));
        drawD3(newData);
      });
    };

  return (
    <main className="center" id="main">

        <div className="page-area">

            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Chart</h1>
                <p>
                    <canvas id="myChart" width="400" height="400"></canvas>
                </p>
            </article>

            <article>
                <h1>D3.js Budget Chart</h1>
                <div id="d3Chart"></div>
                <button className="randomize">Randomize</button>
            </article>

        </div>

    </main>
  );
}

export default HomePage;
