const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');

const searchQuery = 'cat:physics.med-ph+OR+cat:q-bio.QM';
const baseUrl = 'http://export.arxiv.org/api/query';

async function fetchPapers() {
    try {
        const response = await axios.get(`${baseUrl}?search_query=${searchQuery}&max_results=50&sortBy=lastUpdatedDate&sortOrder=descending`);
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        
        const papers = result.feed.entry.map(entry => ({
            title: entry.title[0],
            authors: entry.author.map(author => author.name[0]).join(', '),
            abstract: entry.summary[0],
            pdf_url: entry.link.find(link => link.$.title === 'pdf').$.href,
            published_date: entry.published[0],
            keywords: determineKeywords(entry.title[0] + ' ' + entry.summary[0])
        }));

        fs.writeFileSync('papers_data.json', JSON.stringify(papers, null, 2));
        console.log('Papers data updated successfully');
    } catch (error) {
        console.error('Error fetching papers:', error);
    }
}

function determineKeywords(text) {
    const keywords = [];
    const searchTerms = ['opioid', 'analgesics', 'cancer'];
    text = text.toLowerCase();
    searchTerms.forEach(term => {
        if (text.includes(term)) keywords.push(term);
    });
    return keywords;
}

fetchPapers();
