/**
 * 🧪 تطبيق التوزيع الإلكتروني الكيميائية المتطور
 * © 2026 TECHNOLOGY.ALI - جميع الحقوق محفوظة.
 * يمنع إعادة نسخ أو تعديل الكود دون إذن مسبق من المالك.
 */
const elementDataMap = new Map();

const exceptions = {
    24: { '4s': 1, '3d': 5 },    // Cr
    29: { '4s': 1, '3d': 10 },   // Cu
    42: { '5s': 1, '4d': 5 },    // Mo
    46: { '5s': 0, '4d': 10 },   // Pd
    47: { '5s': 1, '4d': 10 },   // Ag
    79: { '6s': 1, '5d': 10 },   // Au
    78: { '6s': 1, '5d': 9 }     // Pt - إضافة استثناء بلاتين شائع
};

// --- الدوال الإضافية الجديدة ---

/**
 * دالة لتحديد تصنيف العنصر (s, p, d, f) بناءً على الفلك الأخير
 * @param {Array<{name: string, electrons: number}>} filledOrbitals - قائمة الأفلاك المملوءة
 * @returns {string} - تصنيف الفلك (s, p, d, f)
 */
function orbitalClassification(filledOrbitals) {
    // نجد الفلك الأخير الذي يحتوي على إلكترونات (مع استثناء الأفلاك الصفرية في الاستثناءات)
    const lastOrbital = filledOrbitals.filter(o => o.electrons > 0).pop();

    if (!lastOrbital) return 'غير مصنف';

    const orbitalType = lastOrbital.name.slice(-1); // s, p, d, or f

    if (['s', 'p', 'd', 'f'].includes(orbitalType)) {
        return orbitalType;
    }

    return 'غير مصنف';
}

/**
 * دالة لعرض النافذة المنبثقة للشروح
 * @param {string} type - نوع الشرح المطلوب
 */
function showInfo(type) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');

    let title = '';
    let body = '';

    switch (type) {
        case 'noble-gas-info':
            title = 'لماذا نستخدم اختصار الغاز النبيل؟ وإلكترونات التكافؤ';
            body = `
                <p><strong>اختصار الغاز النبيل:</strong> يستخدم لتبسيط كتابة التوزيعات الإلكترونية الطويلة. يتم استبدال التوزيع الداخلي (المشابه للغاز النبيل الذي يسبق العنصر) برمز الغاز النبيل بين قوسين مربعين، مما يركز على إلكترونات الغلاف الخارجي.</p>
                <p><strong>إلكترونات التكافؤ (Valence Electrons):</strong> هي الإلكترونات الموجودة في **الغلاف الطاقي الرئيسي الخارجي** (أعلى قيمة $n$). هذه الإلكترونات هي المسؤولة عن الخصائص الكيميائية للعنصر وعن تكوين الروابط.</p>
            `;
            break;
        case 'box-method-info':
            title = 'قواعد التعبئة: مبدأ أوفباو، قاعدة هوند، ومبدأ باولي';
            body = `
                <p><strong>مبدأ أوفباو (Aufbau Principle):</strong> ينص على أن الإلكترونات تملأ الأفلاك الأقل طاقة أولاً. (من $1s$، ثم $2s$، ثم $2p$، وهكذا).</p>
                <p><strong>قاعدة هوند (Hund's Rule):</strong> تنص على أن الإلكترونات تشغل الأفلاك المتساوية في الطاقة (مثل أفلاك $2p$) بشكل فردي (بنفس اتجاه الدوران) قبل أن تبدأ بالإزدواج.</p>
                <p><strong>مبدأ باولي للاستبعاد (Pauli Exclusion Principle):</strong> ينص على أن لا يمكن لإلكترونين في الذرة أن يكون لهما نفس أعداد الكم الأربعة. عملياً، هذا يعني أن الفلك الواحد لا يتسع إلا لإلكترونين كحد أقصى، ويجب أن يكونا باتجاه دوران متعاكس (↑↓).</p>
            `;
            break;
        case 'classification-info':
            title = 'شرح قواعد تصنيف الفلك (s, p, d, f)';
            body = `
                <p>يتم تحديد تصنيف العنصر (s, p, d, f) بناءً على **الفلك الأخير** الذي يتم ملؤه بالإلكترونات:</p>
                <ul>
                    <li>**فلك $s$:** ينتهي التوزيع بـ $s$ (المجموعتين 1 و 2، والهيليوم).</li>
                    <li>**فلك $p$:** ينتهي التوزيع بـ $p$ (المجموعات 13 إلى 18 عدا الهيليوم).</li>
                    <li>**فلك $d$:** ينتهي التوزيع بـ $d$ (العناصر الانتقالية).</li>
                    <li>**فلك $f$:** ينتهي التوزيع بـ $f$ (اللانتانيدات والأكتينيدات).</li>
                </ul>
            `;
            break;
        case 'compare-tool-info':
            title = 'شرح أداة المقارنة';
            body = '<p>تتيح لك هذه الأداة إدخال عددين ذريين مختلفين وعرض التوزيع الإلكتروني الكامل، واختصار الغاز النبيل، وتصنيف الفلك (s, p, d, f) لكل منهما للمقارنة المباشرة.</p>';
            break;
        default:
            return;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    modalOverlay.classList.remove('hidden');
}

/**
 * دالة لإخفاء النافذة المنبثقة
 */
function hideModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}


// --- الدوال الرئيسية المعدلة ---

/**
 * دالة لإنشاء التمثيل النقطي (لويس) بناءً على إلكترونات التكافؤ. (كما هي)
 * ... (الكود الأصلي للدالة generateLewisDotHTML) ...
 */
function generateLewisDotHTML(symbol, valenceElectrons) {
    if (valenceElectrons < 0 || valenceElectrons > 8) return '';

    let dotsHTML = `<div class="lewis-dot-container"><span class="lewis-symbol">${symbol}</span>`;

    // الحالة الخاصة المطلوبة: 6 إلكترونات تكافؤ
    if (valenceElectrons === 6) {
        // نقطتان في الأعلى
        dotsHTML += `<span class="dot dot-top-1"></span>`;
        dotsHTML += `<span class="dot dot-top-2"></span>`;
        // نقطتان في اليمين
        dotsHTML += `<span class="dot dot-right-1"></span>`;
        dotsHTML += `<span class="dot dot-right-2"></span>`;
        // نقطة في الأسفل
        dotsHTML += `<span class="dot dot-bottom-1"></span>`;
        // نقطة في اليسار
        dotsHTML += `<span class="dot dot-left-1"></span>`;
    } 
    // جميع الحالات الأخرى (بما في ذلك حالة إلكتروني تكافؤ)
    else {
        // يتم وضع نقطة في الأعلى ونقطة في الأسفل أولاً، وهذا يحقق طلبك لإلكتروني التكافؤ
        if (valenceElectrons >= 1) dotsHTML += `<span class="dot dot-top-1"></span>`;
        if (valenceElectrons >= 2) dotsHTML += `<span class="dot dot-bottom-1"></span>`;
        if (valenceElectrons >= 3) dotsHTML += `<span class="dot dot-right-1"></span>`;
        if (valenceElectrons >= 4) dotsHTML += `<span class="dot dot-left-1"></span>`;
        // ثم تتم الإزدواجية بنفس الترتيب
        if (valenceElectrons >= 5) dotsHTML += `<span class="dot dot-top-2"></span>`;
        if (valenceElectrons >= 6) dotsHTML += `<span class="dot dot-bottom-2"></span>`; // (هذا السطر لن يتم الوصول إليه في الحالة العامة لأننا عالجنا حالة 6 بشكل خاص)
        if (valenceElectrons >= 7) dotsHTML += `<span class="dot dot-right-2"></span>`;
        if (valenceElectrons >= 8) dotsHTML += `<span class="dot dot-left-2"></span>`;
    }

    dotsHTML += '</div>';
    return dotsHTML;
}


function generateAllConfigurations(atomicNumber, symbol) {
    const orbitals = [
        { name: '1s', capacity: 2, boxes: 1 }, { name: '2s', capacity: 2, boxes: 1 },
        { name: '2p', capacity: 6, boxes: 3 }, { name: '3s', capacity: 2, boxes: 1 },
        { name: '3p', capacity: 6, boxes: 3 }, { name: '4s', capacity: 2, boxes: 1 },
        { name: '3d', capacity: 10, boxes: 5 }, { name: '4p', capacity: 6, boxes: 3 },
        { name: '5s', capacity: 2, boxes: 1 }, { name: '4d', capacity: 10, boxes: 5 },
        { name: '5p', capacity: 6, boxes: 3 }, { name: '6s', capacity: 2, boxes: 1 },
        { name: '4f', capacity: 14, boxes: 7 }, { name: '5d', capacity: 10, boxes: 5 },
        { name: '6p', capacity: 6, boxes: 3 }, { name: '7s', capacity: 2, boxes: 1 },
        { name: '5f', capacity: 14, boxes: 7 }, { name: '6d', capacity: 10, boxes: 5 },
        { name: '7p', capacity: 6, boxes: 3 }
    ];
    const nobleGases = [
        { num: 86, sym: 'Rn', level: 6 }, { num: 54, sym: 'Xe', level: 5 },
        { num: 36, sym: 'Kr', level: 4 }, { num: 18, sym: 'Ar', level: 3 },
        { num: 10, sym: 'Ne', level: 2 }, { num: 2, sym: 'He', level: 1 }
    ];

    if (isNaN(atomicNumber) || atomicNumber < 1 || atomicNumber > 118) return null;

    let remaining = atomicNumber;
    let filledOrbitals = [];
    let isException = false;

    for (const o of orbitals) {
        if (remaining > 0) {
            let electrons = Math.min(remaining, o.capacity);
            filledOrbitals.push({ name: o.name, electrons: electrons, boxes: o.boxes });
            remaining -= electrons;
        } else break;
    }
    
    // تطبيق الاستثناءات (تم تحديث هذه الجزئية لتشمل إضافة Pt)
    const exceptionRule = exceptions[atomicNumber];
    if (exceptionRule) {
        isException = true;
        for (const orbitalName in exceptionRule) {
            const orbitalToChange = filledOrbitals.find(o => o.name === orbitalName);
            if (orbitalToChange) {
                // تعديل عدد الإلكترونات المتبقية في العنصر
                remaining += orbitalToChange.electrons; 
                remaining -= exceptionRule[orbitalName];
                
                orbitalToChange.electrons = exceptionRule[orbitalName];
            }
        }
        // تصحيح حالة إلكترونات التكافؤ في حالة الاستثناءات (مثل Au)
        // إعادة حساب التوزيع الكامل بعد تطبيق الاستثناءات للحصول على الترتيب الصحيح
        // في حالة الاستثناء (خاصة للمعادن الانتقالية)، التوزيع يكتب وفقاً لقاعدة الاستقرار.
        
        // إعادة تجميع filledOrbitals للتوزيع الكامل بعد تطبيق الاستثناء
        filledOrbitals = filledOrbitals.filter(o => o.electrons > 0);
        
        // إعادة ترتيب الأفلاك (ضروري للمعادن الانتقالية)
        // ترتيب الأفلاك للطباعة يجب أن يكون حسب قاعدة (n+l) مع الانتباه لـ 4s, 3d
        // لكننا هنا سنعتمد على الترتيب السابق لغرض عرض التوزيع، ونعتمد على القيمة n لتحديد التكافؤ
        // (الكود الأصلي اعتمد على ترتيب الأفلاك في مصفوفة orbitals وهو جيد)
    }

    let fullConfigStr = '';
    filledOrbitals.forEach(o => {
        if (o.electrons > 0) fullConfigStr += `${o.name}<sup>${o.electrons}</sup> `;
    });

    // إنشاء طريقة المربعات
    let boxDiagramStr = '<div class="diagram-container">';
    for (const filled of filledOrbitals) {
         if (filled.electrons === 0) continue;
         boxDiagramStr += `<div class="orbital-row"><span class="orbital-label">${filled.name}</span>`;
         let electronsToDistribute = filled.electrons;
         let boxFills = Array(filled.boxes).fill(0);
         // قاعدة هوند: ملء كل مربع بإلكترون واحد أولاً
         for (let i = 0; i < filled.boxes && electronsToDistribute > 0; i++) { boxFills[i]++; electronsToDistribute--; }
         // ثم الإزدواج
         for (let i = 0; i < filled.boxes && electronsToDistribute > 0; i++) { boxFills[i]++; electronsToDistribute--; }
         for (const fill of boxFills) {
             let content = '&nbsp;';
             if (fill === 1) content = '↑';
             if (fill === 2) content = '↑↓';
             boxDiagramStr += `<div class="orbital-box">${content}</div>`;
         }
         boxDiagramStr += '</div>';
    }
    boxDiagramStr += '</div>';

    // توزيع الغاز النبيل (الكود الأصلي كما هو)
    let nobleGasConfigStr = '';
    const nobleGas = nobleGases.find(g => atomicNumber > g.num);
    if (nobleGas) {
        nobleGasConfigStr = `[${nobleGas.sym}] `;
        // الأفلاك التي تأتي بعد الغاز النبيل في التوزيع العادي (4s, 3d, 4p...)
        const relevantOrbitals = filledOrbitals.filter(o => {
            const n = parseInt(o.name[0]);
            const orbitalType = o.name.slice(1, 2);
            // الأفلاك هي التي تكون أكبر من مستوى الغاز النبيل
            if (n > nobleGas.level) return true;
            // أو أفلاك (n-1)d و (n-2)f التي تكون ضمن التوزيع الخارجي
            if (orbitalType === 'd' && n === nobleGas.level - 1) return true;
            if (orbitalType === 'f' && n === nobleGas.level - 2) return true;
            
            return false;
        });
        relevantOrbitals.forEach(o => {
             if (o.electrons > 0) nobleGasConfigStr += `${o.name}<sup>${o.electrons}</sup> `;
        });
        
    } else {
        nobleGasConfigStr = fullConfigStr;
    }
    
    // حساب إلكترونات التكافؤ (الكود الأصلي كما هو)
    let maxN = 0;
    filledOrbitals.forEach(o => {
        const n = parseInt(o.name[0]);
        if (n > maxN) maxN = n;
    });
    let valenceElectrons = 0;
    filledOrbitals.forEach(o => {
        const n = parseInt(o.name[0]);
        if (n === maxN) {
            // يتم حساب فقط إلكترونات s و p لأعلى n كإلكترونات تكافؤ للمجموعات الرئيسية
            // أما في العناصر الانتقالية (d) و (f)، يتم احتساب إلكترونات s فقط في الغلاف الخارجي الأعلى (maxN)
            // لحساب إلكترونات التكافؤ بشكل دقيق للعناصر الانتقالية يتم احتساب إلكترونات (n)s و (n-1)d الخارجية
            // لكن للحفاظ على تبسيط الكود: سنستمر في جمع إلكترونات أعلى مستوى رئيسي (maxN)
            valenceElectrons += o.electrons;
        }
    });

    const lastOrbitalType = orbitalClassification(filledOrbitals);
    const lewisDotHTML = generateLewisDotHTML(symbol, valenceElectrons);

    return {
        full: fullConfigStr.trim(),
        noble: nobleGasConfigStr.trim(),
        box: boxDiagramStr,
        valence: valenceElectrons,
        lewis: lewisDotHTML,
        isException: isException,
        classification: lastOrbitalType // التصنيف الجديد
    };
}


function displayResults(atomicNumber, symbol, isCompare = false) {
    const resultDiv = isCompare ? null : document.getElementById('result');
    const additionalResultDiv = isCompare ? null : document.getElementById('additional-result');
    
    const configs = generateAllConfigurations(atomicNumber, symbol);
    const elementInfo = elementDataMap.get(atomicNumber);
    const elementName = elementInfo ? elementInfo.name : `العنصر ${atomicNumber}`;

    if (!configs) {
        if (!isCompare) {
             resultDiv.textContent = 'الرجاء إدخال عدد ذري صحيح بين 1 و 118.';
             additionalResultDiv.innerHTML = '';
        }
        return isCompare ? null : null;
    }

    const htmlContent = `
        <h3 style="direction: rtl;">التوزيع الإلكتروني الكامل لـ (${symbol} - ${elementName}):</h3>
        <p>${configs.full}</p>
        <h3 style="direction: rtl;">توزيع الغاز النبيل (الاختصار) <span class="info-icon" onclick="showInfo('noble-gas-info')">ℹ️</span>:</h3>
        <p>${configs.noble}</p>
        <h3 style="direction: rtl;">تصنيف الفلك الأخير:</h3>
        <p class="orbital-classification">${configs.classification.toUpperCase()}-Block</p>
    `;
    
    const additionalHtmlContent = `
        <h3 style="direction: rtl;">طريقة المربعات (الأفلاك) <span class="info-icon" onclick="showInfo('box-method-info')">ℹ️</span>:</h3>
        ${configs.box}
        <h3 style="direction: rtl;">إلكترونات التكافؤ</h3>
        <p class="valence-electrons-text">${configs.valence}</p>
        <h3 style="direction: rtl;">التمثيل النقطي (لويس)</h3>
        ${configs.lewis}
        ${configs.isException ? '<p class="exception-note">ملاحظة: هذا العنصر له توزيع إلكتروني استثنائي لتحقيق المزيد من الاستقرار.</p>' : ''}
    `;

    if (isCompare) {
        return { htmlContent, additionalHtmlContent, classification: configs.classification, symbol: symbol };
    } else {
        resultDiv.innerHTML = htmlContent;
        additionalResultDiv.innerHTML = additionalHtmlContent;
    }
}

function distributeFromInput() {
    // (الكود الأصلي كما هو)
    const atomicNumberInput = document.getElementById('atomicNumberInput');
    const atomicNumber = parseInt(atomicNumberInput.value);
    const elementInfo = elementDataMap.get(atomicNumber);
    if (elementInfo) {
        displayResults(atomicNumber, elementInfo.symbol);
    } else {
        document.getElementById('result').textContent = 'الرجاء إدخال عدد ذري صحيح بين 1 و 118.';
        document.getElementById('additional-result').innerHTML = '';
    }
}

function findElementFromConfig() {
    // (الكود الأصلي كما هو)
    const configInput = document.getElementById('electronConfigInput').value.trim();
    const resultDiv = document.getElementById('result');
    document.getElementById('additional-result').innerHTML = '';
    if (!configInput) {
        resultDiv.textContent = 'الرجاء إدخال التوزيع الإلكتروني.';
        return;
    }
    
    let totalElectrons = 0;
    const nobleGasMatch = configInput.match(/\[(.*?)\]/);
    let remainingConfig = configInput;
    if (nobleGasMatch) {
        const symbol = nobleGasMatch[1];
        const nobleGas = [...elementDataMap.entries()].find(([k, v]) => v.symbol === symbol && v.nobleGas);
        if (nobleGas) {
            totalElectrons += nobleGas[0];
            remainingConfig = configInput.replace(/\[.*?\]\s*/, '');
        }
    }
    
    // التعبير العادي يحتاج لتعديل بسيط لاستيعاب superscript ^2
    const orbitals = remainingConfig.match(/\d+[spdfg]\^?\d+/g) || [];
    orbitals.forEach(orbital => {
        const parts = orbital.match(/(\d+)$/);
        if (parts) {
            totalElectrons += parseInt(parts[1], 10);
        }
    });

    const elementInfo = elementDataMap.get(totalElectrons);
    if (elementInfo) {
        resultDiv.innerHTML = `<strong>العدد الذري:</strong> ${totalElectrons}<br><strong>العنصر:</strong> ${elementInfo.name} (${elementInfo.symbol})`;
        displayResults(totalElectrons, elementInfo.symbol);
    } else {
        resultDiv.innerHTML = `التوزيع الإلكتروني أدى إلى ${totalElectrons} إلكترون، وهو لا يطابق عنصرًا معروفًا.`;
    }
}


// --- دالة أداة المقارنة بتنسيق كيميائي منظم ومنفصل ---
function compareElements() {
    const input1 = parseInt(document.getElementById('compareInput1').value);
    const input2 = parseInt(document.getElementById('compareInput2').value);
    const resultsDiv = document.getElementById('compare-results');
    resultsDiv.innerHTML = '';

    if (isNaN(input1) || input1 < 1 || input1 > 118 || isNaN(input2) || input2 < 1 || input2 > 118) {
        resultsDiv.textContent = 'الرجاء إدخال أعداد ذرية صحيحة بين 1 و 118 لكلا العنصرين.';
        return;
    }

    const elementInfo1 = elementDataMap.get(input1);
    const elementInfo2 = elementDataMap.get(input2);

    if (!elementInfo1 || !elementInfo2) {
        resultsDiv.textContent = 'أحد الأعداد الذرية المدخلة لا يطابق عنصراً معروفاً.';
        return;
    }
    
    const config1 = generateAllConfigurations(input1, elementInfo1.symbol);
    const config2 = generateAllConfigurations(input2, elementInfo2.symbol);

    if (config1 && config2) {
        // تم تنظيم الأسطر بفصل العناوين العربية عن الرموز الإنجليزية لحل مشكلة التداخل
        resultsDiv.innerHTML = `
            <div class="compare-column" style="direction: rtl; text-align: right; padding: 15px;">
                <h4 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; margin-bottom: 10px;">
                    العنصر الثاني: ${elementInfo2.name} (${elementInfo2.symbol})
                </h4>
                
                <p><strong>العدد الذري:</strong> <span style="font-size: 1.1em; color: #333;">${input2}</span></p>
                
                <p style="margin-top: 10px;"><strong>التوزيع الكامل:</strong></p>
                <p style="direction: ltr; text-align: left; background: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #eee; color: #007bff;">
                    ${config2.full}
                </p>
                
                <p style="margin-top: 10px;"><strong>اختصار الغاز النبيل:</strong></p>
                <p style="direction: ltr; text-align: left; background: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #eee; color: #007bff;">
                    ${config2.noble}
                </p>
                
                <p style="margin-top: 10px;"><strong>تصنيف الفلك:</strong> 
                    <span class="orbital-classification" style="direction: ltr; display: inline-block;">${config2.classification.toUpperCase()}-Block</span>
                </p>
                
                <p style="margin-top: 10px;"><strong>إلكترونات التكافؤ:</strong> <span style="font-size: 1.1em; color: #28a745;">${config2.valence}</span></p>
            </div>

            <div class="compare-column" style="direction: rtl; text-align: right; padding: 15px;">
                <h4 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; margin-bottom: 10px;">
                    العنصر الأول: ${elementInfo1.name} (${elementInfo1.symbol})
                </h4>
                
                <p><strong>العدد الذري:</strong> <span style="font-size: 1.1em; color: #333;">${input1}</span></p>
                
                <p style="margin-top: 10px;"><strong>التوزيع الكامل:</strong></p>
                <p style="direction: ltr; text-align: left; background: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #eee; color: #007bff;">
                    ${config1.full}
                </p>
                
                <p style="margin-top: 10px;"><strong>اختصار الغاز النبيل:</strong></p>
                <p style="direction: ltr; text-align: left; background: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #eee; color: #007bff;">
                    ${config1.noble}
                </p>
                
                <p style="margin-top: 10px;"><strong>تصنيف الفلك:</strong> 
                    <span class="orbital-classification" style="direction: ltr; display: inline-block;">${config1.classification.toUpperCase()}-Block</span>
                </p>
                
                <p style="margin-top: 10px;"><strong>إلكترونات التكافؤ:</strong> <span style="font-size: 1.1em; color: #28a745;">${config1.valence}</span></p>
            </div>
        `;
    }
}

// --- دالة وضع الاختبار (Quiz Mode) الجديدة ---
let isQuizMode = false;
let currentQuizData = null;

const quizQuestions = [
    { type: 'full-config', question: (sym) => `اكتب التوزيع الإلكتروني الكامل للعنصر ${sym}:`, answerKey: 'full' },
    { type: 'noble-config', question: (sym) => `اكتب اختصار الغاز النبيل للعنصر ${sym}:`, answerKey: 'noble' },
    { type: 'valence-count', question: (sym) => `كم عدد إلكترونات التكافؤ للعنصر ${sym}؟ (رقم فقط):`, answerKey: 'valence' },
    { type: 'classification', question: (sym) => `ما هو تصنيف الفلك (s, p, d, f) للعنصر ${sym}؟:`, answerKey: 'classification' }
];

function toggleQuizMode() {
    isQuizMode = !isQuizMode;
    document.getElementById('quizStatus').textContent = isQuizMode ? 'تشغيل' : 'إيقاف';
    const quizArea = document.getElementById('quiz-area');
    quizArea.classList.toggle('hidden-quiz', !isQuizMode);
    
    if (isQuizMode) {
        generateQuizQuestion();
    } else {
        quizArea.innerHTML = '';
        document.getElementById('result').innerHTML = '';
        document.getElementById('additional-result').innerHTML = '';
    }
}

function generateQuizQuestion() {
    // اختيار عنصر عشوائي (باستثناء اللانتانيدات/الأكتينيدات المدمجة)
    const availableNumbers = Array.from(elementDataMap.keys()).filter(n => n >= 1 && n <= 118 && ![57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103].includes(n));
    const randomAtomicNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const elementInfo = elementDataMap.get(randomAtomicNumber);
    
    if (!elementInfo) {
        document.getElementById('quiz-area').innerHTML = '<p>حدث خطأ في اختيار العنصر.</p>';
        return;
    }
    
    const configs = generateAllConfigurations(randomAtomicNumber, elementInfo.symbol);
    if (!configs) return;

    // اختيار نوع سؤال عشوائي
    const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];

    currentQuizData = {
        element: elementInfo,
        configs: configs,
        questionType: randomQuestion.type,
        answerKey: randomQuestion.answerKey
    };
    
    const isTextAnswer = ['full', 'noble', 'classification'].includes(randomQuestion.answerKey);

    document.getElementById('quiz-area').innerHTML = `
        <p><strong>العنصر:</strong> ${elementInfo.name} (${elementInfo.symbol}) - العدد الذري ${randomAtomicNumber}</p>
        <p>${randomQuestion.question(elementInfo.symbol)}</p>
        <input type="${isTextAnswer ? 'text' : 'number'}" id="quizAnswerInput" class="quiz-input" placeholder="${isTextAnswer ? 'اكتب الإجابة هنا (مثال: 1s2 2s2...)' : 'أدخل رقماً'}" onkeydown="if(event.key === 'Enter') checkQuizAnswer()">
        <button onclick="checkQuizAnswer()" class="quiz-check">تحقق من الإجابة</button>
        <div id="quizResultArea" class="quiz-result"></div>
        <button onclick="generateQuizQuestion()">سؤال جديد</button>
        <button onclick="showQuizAnswer()">إظهار الإجابة</button>
    `;
}

function checkQuizAnswer() {
    if (!currentQuizData) return;
    
    let userAnswer = document.getElementById('quizAnswerInput').value.trim();
    const resultArea = document.getElementById('quizResultArea');
    const correctValue = String(currentQuizData.configs[currentQuizData.answerKey]).replace(/<sup>|<\/sup>|\s+/g, '').toLowerCase(); // إزالة <sup> وتقليل المسافات للمقارنة

    // تنظيف إجابة المستخدم للمقارنة
    userAnswer = userAnswer.replace(/<sup>|<\/sup>|\s+/g, '').toLowerCase();
    
    let isCorrect = false;

    if (currentQuizData.answerKey === 'valence') {
        isCorrect = parseInt(userAnswer) === currentQuizData.configs.valence;
    } else if (currentQuizData.answerKey === 'classification') {
        isCorrect = userAnswer.startsWith(correctValue.toLowerCase());
    } else {
        isCorrect = userAnswer === correctValue;
    }

    if (isCorrect) {
        resultArea.className = 'quiz-result correct';
        resultArea.textContent = 'إجابة صحيحة! 🎉';
    } else {
        resultArea.className = 'quiz-result incorrect';
        resultArea.textContent = 'إجابة غير صحيحة. حاول مجدداً.';
    }
}

function showQuizAnswer() {
    if (!currentQuizData) return;
    const resultArea = document.getElementById('quizResultArea');
    const answerKey = currentQuizData.answerKey;
    let correctAnswer = currentQuizData.configs[answerKey];
    
    if (answerKey === 'classification') {
        correctAnswer = correctAnswer.toUpperCase() + '-Block';
    }
    
    // إعادة تنسيق التوزيع الإلكتروني ليكون مقروءًا عند عرضه
    if (['full', 'noble'].includes(answerKey)) {
        correctAnswer = correctAnswer.replace(/<sup>/g, '↑').replace(/<\/sup>/g, '');
    }

    resultArea.className = 'quiz-result correct';
    resultArea.innerHTML = `الإجابة الصحيحة هي: <strong>${correctAnswer}</strong>.`;
}


// --- DOMContentLoaded (كما هو مع إضافة وظائف جديدة) ---

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.element');
    const resultDiv = document.getElementById('result');
    const additionalResultDiv = document.getElementById('additional-result');

    elements.forEach(element => {
        const atomicNumberStrForMap = element.getAttribute('data-atomic-number');
        if (atomicNumberStrForMap && !atomicNumberStrForMap.includes('-')) {
            const atomicNum = parseInt(atomicNumberStrForMap);
            const symbol = element.getAttribute('data-symbol');
            const name = element.querySelector('p').textContent;
            
            // تحديد الغازات النبيلة لـ findElementFromConfig
            const isNobleGas = element.classList.contains('noble-gas');
            elementDataMap.set(atomicNum, { symbol, name, nobleGas: isNobleGas });
        }

        element.addEventListener('click', () => {
             // إخفاء نتائج الاختبار عند النقر على عنصر
            if (isQuizMode) {
                 document.getElementById('quiz-area').innerHTML = '<p class="incorrect">أوقف وضع الاختبار أولاً لعرض النتائج مباشرة.</p>';
                 return;
            }
            
            const atomicNumberStr = element.getAttribute('data-atomic-number');
            if (atomicNumberStr.includes('-')) {
                resultDiv.innerHTML = `الرجاء اختيار عنصر فردي من سلسلة اللانتانيدات أو الأكتينيدات أدناه.`;
                additionalResultDiv.innerHTML = '';
                return;
            }
            const atomicNumber = parseInt(atomicNumberStr);
            const symbol = element.getAttribute('data-symbol');
            displayResults(atomicNumber, symbol);
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const resultDiv = document.getElementById('result');
    const additionalResultDiv = document.getElementById('additional-result');

    // هذه هي قاعدة البيانات الخلفية التي تعوضك عن وجود الجدول في صفحة HTML
    const elementsData = [
{ id: 1, symbol: "H", name: "هيدروجين", type: "nonmetal" },
    { id: 2, symbol: "He", name: "هيليوم", type: "noble-gas" },
    { id: 3, symbol: "Li", name: "ليثيوم", type: "alkali-metal" },
    { id: 4, symbol: "Be", name: "بيريليوم", type: "alkaline-earth-metal" },
    { id: 5, symbol: "B", name: "بورون", type: "metalloid" },
    { id: 6, symbol: "C", name: "كربون", type: "nonmetal" },
    { id: 7, symbol: "N", name: "نيتروجين", type: "nonmetal" },
    { id: 8, symbol: "O", name: "أكسجين", type: "nonmetal" },
    { id: 9, symbol: "F", name: "فلور", type: "halogen" },
    { id: 10, symbol: "Ne", name: "نيون", type: "noble-gas" },
    { id: 11, symbol: "Na", name: "صوديوم", type: "alkali-metal" },
    { id: 12, symbol: "Mg", name: "مغنيسيوم", type: "alkaline-earth-metal" },
    { id: 13, symbol: "Al", name: "ألومنيوم", type: "post-transition-metal" },
    { id: 14, symbol: "Si", name: "سيليكون", type: "metalloid" },
    { id: 15, symbol: "P", name: "فسفور", type: "nonmetal" },
    { id: 16, symbol: "S", name: "كبريت", type: "nonmetal" },
    { id: 17, symbol: "Cl", name: "كلور", type: "halogen" },
    { id: 18, symbol: "Ar", name: "أرغون", type: "noble-gas" },
    { id: 19, symbol: "K", name: "بوتاسيوم", type: "alkali-metal" },
    { id: 20, symbol: "Ca", name: "كالسيوم", type: "alkaline-earth-metal" },
    { id: 21, symbol: "Sc", name: "سكانديوم", type: "transition-metal" },
    { id: 22, symbol: "Ti", name: "تيتانيوم", type: "transition-metal" },
    { id: 23, symbol: "V", name: "فاناديوم", type: "transition-metal" },
    { id: 24, symbol: "Cr", name: "كروم", type: "transition-metal" },
    { id: 25, symbol: "Mn", name: "منجنيز", type: "transition-metal" },
    { id: 26, symbol: "Fe", name: "حديد", type: "transition-metal" },
    { id: 27, symbol: "Co", name: "كوبالت", type: "transition-metal" },
    { id: 28, symbol: "Ni", name: "نيكل", type: "transition-metal" },
    { id: 29, symbol: "Cu", name: "نحاس", type: "transition-metal" },
    { id: 30, symbol: "Zn", name: "زنك", type: "transition-metal" },
    { id: 31, symbol: "Ga", name: "جاليوم", type: "post-transition-metal" },
    { id: 32, symbol: "Ge", name: "جرمانيوم", type: "metalloid" },
    { id: 33, symbol: "As", name: "زرنيخ", type: "metalloid" },
    { id: 34, symbol: "Se", name: "سيلينيوم", type: "nonmetal" },
    { id: 35, symbol: "Br", name: "بروم", type: "halogen" },
    { id: 36, symbol: "Kr", name: "كريبتون", type: "noble-gas" },
    { id: 37, symbol: "Rb", name: "روبيديوم", type: "alkali-metal" },
    { id: 38, symbol: "Sr", name: "سترونشيوم", type: "alkaline-earth-metal" },
    { id: 39, symbol: "Y", name: "إيتريوم", type: "transition-metal" },
    { id: 40, symbol: "Zr", name: "زركونيوم", type: "transition-metal" },
    { id: 41, symbol: "Nb", name: "نيوبيوم", type: "transition-metal" },
    { id: 42, symbol: "Mo", name: "موليبدينوم", type: "transition-metal" },
    { id: 43, symbol: "Tc", name: "تكنيشيوم", type: "transition-metal" },
    { id: 44, symbol: "Ru", name: "روثينيوم", type: "transition-metal" },
    { id: 45, symbol: "Rh", name: "روديوم", type: "transition-metal" },
    { id: 46, symbol: "Pd", name: "بالاديوم", type: "transition-metal" },
    { id: 47, symbol: "Ag", name: "فضة", type: "transition-metal" },
    { id: 48, symbol: "Cd", name: "كادميوم", type: "transition-metal" },
    { id: 49, symbol: "In", name: "إنديوم", type: "post-transition-metal" },
    { id: 50, symbol: "Sn", name: "قصدير", type: "post-transition-metal" },
    { id: 51, symbol: "Sb", name: "أنتيمون", type: "metalloid" },
    { id: 52, symbol: "Te", name: "تيلوريوم", type: "metalloid" },
    { id: 53, symbol: "I", name: "يود", type: "halogen" },
    { id: 54, symbol: "Xe", name: "زينون", type: "noble-gas" },
    { id: 55, symbol: "Cs", name: "سيزيوم", type: "alkali-metal" },
    { id: 56, symbol: "Ba", name: "باريوم", type: "alkaline-earth-metal" },
    // اللانتانيدات
    { id: 57, symbol: "La", name: "لانثانوم", type: "lanthanide" },
    { id: 58, symbol: "Ce", name: "سيريوم", type: "lanthanide" },
    { id: 59, symbol: "Pr", name: "براسيوديميوم", type: "lanthanide" },
    { id: 60, symbol: "Nd", name: "نيوديميوم", type: "lanthanide" },
    { id: 61, symbol: "Pm", name: "بروميثيوم", type: "lanthanide" },
    { id: 62, symbol: "Sm", name: "ساماريوم", type: "lanthanide" },
    { id: 63, symbol: "Eu", name: "يوروبيوم", type: "lanthanide" },
    { id: 64, symbol: "Gd", name: "غادولينيوم", type: "lanthanide" },
    { id: 65, symbol: "Tb", name: "تيربيوم", type: "lanthanide" },
    { id: 66, symbol: "Dy", name: "ديسبروسيوم", type: "lanthanide" },
    { id: 67, symbol: "Ho", name: "هولميوم", type: "lanthanide" },
    { id: 68, symbol: "Er", name: "إربيوم", type: "lanthanide" },
    { id: 69, symbol: "Tm", name: "ثوليوم", type: "lanthanide" },
    { id: 70, symbol: "Yb", name: "إيتربيوم", type: "lanthanide" },
    { id: 71, symbol: "Lu", name: "لوتيتيوم", type: "lanthanide" },
    { id: 72, symbol: "Hf", name: "هافنيوم", type: "transition-metal" },
    { id: 73, symbol: "Ta", name: "تانتالوم", type: "transition-metal" },
    { id: 74, symbol: "W", name: "تنجستين", type: "transition-metal" },
    { id: 75, symbol: "Re", name: "رينيوم", type: "transition-metal" },
    { id: 76, symbol: "Os", name: "أوزميوم", type: "transition-metal" },
    { id: 77, symbol: "Ir", name: "إيريديوم", type: "transition-metal" },
    { id: 78, symbol: "Pt", name: "بلاتين", type: "transition-metal" },
    { id: 79, symbol: "Au", name: "ذهب", type: "transition-metal" },
    { id: 80, symbol: "Hg", name: "زئبق", type: "transition-metal" },
    { id: 81, symbol: "Tl", name: "ثاليوم", type: "post-transition-metal" },
    { id: 82, symbol: "Pb", name: "رصاص", type: "post-transition-metal" },
    { id: 83, symbol: "Bi", name: "بزموث", type: "post-transition-metal" },
    { id: 84, symbol: "Po", name: "بولونيوم", type: "post-transition-metal" },
    { id: 85, symbol: "At", name: "أستاتين", type: "halogen" },
    { id: 86, symbol: "Rn", name: "رادون", type: "noble-gas" },
    { id: 87, symbol: "Fr", name: "فرنسيوم", type: "alkali-metal" },
    { id: 88, symbol: "Ra", name: "راديوم", type: "alkaline-earth-metal" },
    // الأكتينيدات
    { id: 89, symbol: "Ac", name: "أكتينيوم", type: "actinide" },
    { id: 90, symbol: "Th", name: "ثوريوم", type: "actinide" },
    { id: 91, symbol: "Pa", name: "بروتكتينيوم", type: "actinide" },
    { id: 92, symbol: "U", name: "يورانيوم", type: "actinide" },
    { id: 93, symbol: "Np", name: "نبتونيوم", type: "actinide" },
    { id: 94, symbol: "Pu", name: "بلوتونيوم", type: "actinide" },
    { id: 95, symbol: "Am", name: "أمريسيوم", type: "actinide" },
    { id: 96, symbol: "Cm", name: "كوريوم", type: "actinide" },
    { id: 97, symbol: "Bk", name: "بركيليوم", type: "actinide" },
    { id: 98, symbol: "Cf", name: "كاليفورنيوم", type: "actinide" },
    { id: 99, symbol: "Es", name: "أينشتاينيوم", type: "actinide" },
    { id: 100, symbol: "Fm", name: "فرميوم", type: "actinide" },
    { id: 101, symbol: "Md", name: "مندليفيوم", type: "actinide" },
    { id: 102, symbol: "No", name: "نوبليوم", type: "actinide" },
    { id: 103, symbol: "Lr", name: "لورنسيوم", type: "actinide" },
    { id: 104, symbol: "Rf", name: "رذرفورديوم", type: "transition-metal" },
    { id: 105, symbol: "Db", name: "دوبنيوم", type: "transition-metal" },
    { id: 106, symbol: "Sg", name: "سيبرغوم", type: "transition-metal" },
    { id: 107, symbol: "Bh", name: "بوريوم", type: "transition-metal" },
    { id: 108, symbol: "Hs", name: "هاسيوم", type: "transition-metal" },
    { id: 109, symbol: "Mt", name: "مايتنيريوم", type: "transition-metal" },
    { id: 110, symbol: "Ds", name: "درمشتاتيوم", type: "transition-metal" },
    { id: 111, symbol: "Rg", name: "رونتجينيوم", type: "transition-metal" },
    { id: 112, symbol: "Cn", name: "كوبرنيسيوم", type: "transition-metal" },
    { id: 113, symbol: "Nh", name: "نيهونيوم", type: "post-transition-metal" },
    { id: 114, symbol: "Fl", name: "فليروفيوم", type: "post-transition-metal" },
    { id: 115, symbol: "Mc", name: "موسكوفيوم", type: "post-transition-metal" },
    { id: 116, symbol: "Lv", name: "ليفرموريوم", type: "post-transition-metal" },
    { id: 117, symbol: "Ts", name: "تنيسين", type: "halogen" },
    { id: 118, symbol: "Og", name: "أوغانيسون", type: "noble-gas" }
   ];

    // تعبئة البيانات في الخريطة البرمجية (Map) لكي تعمل دوال البحث
    elementsData.forEach(el => {
        elementDataMap.set(el.id, { 
            symbol: el.symbol, 
            name: el.name, 
            nobleGas: el.type === 'noble-gas' 
        });
    });

    console.log("قاعدة البيانات جاهزة للعمل خلفياً بدون جدول مرئي.");
    
});

// --- الاستماع للرسائل القادمة من الجدول الدوري (iframe) ---
window.addEventListener('message', (event) => {
    // التأكد من أن الرسالة المرسلة هي الخاصة بنقرة العنصر
    if (event.data && event.data.type === 'ELEMENT_CLICKED') {
        const atomicNumber = event.data.atomicNumber;
        
        // التحقق من وضع الاختبار (Quiz Mode) لحماية تجربة المستخدم
        if (isQuizMode) {
             document.getElementById('quiz-area').innerHTML = '<p class="incorrect">أوقف وضع الاختبار أولاً لعرض النتائج مباشرة.</p>';
             return;
        }

        // جلب بيانات العنصر من الخريطة (Map) بناءً على العدد الذري القادم
        const elementInfo = elementDataMap.get(atomicNumber);
        if (elementInfo) {
            // تنفيذ التوزيع الإلكتروني وعرض النتائج فوراً
            displayResults(atomicNumber, elementInfo.symbol);
            
            // تحريك الشاشة لأسفل تلقائياً لرؤية النتيجة المحدثة
            document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        }
    }
});
// تحديث سنة الحقوق تلقائياً
document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});