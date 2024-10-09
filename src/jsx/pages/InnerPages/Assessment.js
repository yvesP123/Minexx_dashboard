import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, ListGroup, Nav } from 'react-bootstrap';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import { ThemeContext } from '../../../context/ThemeContext';
import { assessmentHeaders } from '../../../config';
import { translations } from './AssessmentTranslation';

const Assessment = ({ language, country }) => {
  const t = (key) => {
    if (!translations[language]) {
      console.warn(`Translation for language "${language}" not found`);
      return key;
    }
    return translations[language][key] || key;
  };

  const headers = [
    t('General Information'),
    t('Legitimacy'),
    t('Human & Workers Rights'),
    t('Societal Welfare/Security'),
    t('Company Governance'),
    t('Chain of Custody/Traceability/Tracking'),
    t('Environment'),
    t('Community Impact')
  ];

  const translatedHeaders = headers.map(header => t(header));

  const indexes = ['general', 'legitimacy', 'rights', 'welfare', 'governance', 'traceability', 'environment', 'community'];
  const slices = [
    { start: 1, end: assessmentHeaders.indexOf(`LEGITIMACY`) },
    { start: assessmentHeaders.indexOf(`LEGITIMACY`) + 1, end: assessmentHeaders.indexOf(`HUMAN AND WORKERS RIGTHS`) },
    { start: assessmentHeaders.indexOf(`HUMAN AND WORKERS RIGTHS`) + 1, end: assessmentHeaders.indexOf(`SOCIETAL WELFARE / SECURITY`) },
    { start: assessmentHeaders.indexOf(`SOCIETAL WELFARE / SECURITY`) + 1, end: assessmentHeaders.indexOf(`COMPANY GOVERNANCE`) },
    { start: assessmentHeaders.indexOf(`COMPANY GOVERNANCE`) + 1, end: assessmentHeaders.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`) },
    { start: assessmentHeaders.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`) + 1, end: assessmentHeaders.indexOf(`ENVIRONMENT`) },
    { start: assessmentHeaders.indexOf(`ENVIRONMENT`) + 1, end: assessmentHeaders.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`) },
    { start: assessmentHeaders.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`) + 1 },
  ];

  const [slice, setSlice] = useState(slices[0]);
  const [index, setIndex] = useState(0);
  const { changeTitle } = useContext(ThemeContext);
  const assessment = JSON.parse(localStorage.getItem(`assessment`));

  useEffect(() => {
    changeTitle(t('Assessment Details | Minexx'));
  }, [language, country]);

  return (
    <div>
      <div className="row page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active"><Link to={"/overview"}>{t("Dashboard")}</Link></li>
          <li className="breadcrumb-item"><Link to={"/mines"}>{t("Mines")}</Link></li>
          <li className="breadcrumb-item"><Link to={""}>{t("AssessmentDetails")}</Link></li>
        </ol>
      </div>
      <div className="row">
        <div className="col-xl-3">
          <ListGroup className="mb-4" id="list-tab">
            {translatedHeaders.map((item, i) => (
              <ListGroup.Item key={i} onClick={() => { setIndex(i); setSlice(slices[i]); }} action href={`#${i}`}>
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div className='col-9'>
          <div className='card'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-12'>
                  <Accordion className="accordion accordion-primary" defaultActiveKey="0">
                    {assessmentHeaders.slice(slice.start, slice.end).filter((x, i) => assessment[indexes[index]][i]).length > 0 ? 
                      assessmentHeaders.slice(slice.start, slice.end).map((h, i) => 
                        assessment[indexes[index]][i] && !h.includes('ID Number') && !h.includes('Mine/Concession Name') ? (
                          <Accordion.Item className="accordion-item" key={i} eventKey={i}>
                            <Accordion.Header className="accordion-header rounded-lg">
                              {t(h)}
                            </Accordion.Header>
                            <Accordion.Collapse eventKey={i}>
                              <div className="accordion-body">
                                {h.includes('Proof Details') ||
                                h.includes('Image') ||
                                h.includes('Photo') ||
                                h.includes('Pictures') ?
                                  <img alt='' src={`https://lh3.googleusercontent.com/d/${assessment[indexes[index]][i]}=w2160?authuser=0`} /> : 
                                  <p>{assessment[indexes[index]][i]}</p>}
                              </div>
                            </Accordion.Collapse>
                          </Accordion.Item>
                        ) : null
                      ) : 
                      <p className='font-w200 text-center'>{t('No information recorded')}</p>
                    }
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;