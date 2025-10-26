import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Smile, CheckCircle, Users, Home, Gamepad2, BookOpen, Info, HelpCircle, Menu, X, Play, Award, Target, Heart, ArrowRight, RotateCcw, Star, TrendingUp } from 'lucide-react'


// Game State Management Hook
function useGameState() {
  const [userProgress, setUserProgress] = useState({
    gamesCompleted: 0,
    totalScore: 0,
    achievements: [],
    currentStreak: 0
  })

  const updateProgress = (gameId, score, completed = false) => {
    setUserProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      gamesCompleted: completed ? prev.gamesCompleted + 1 : prev.gamesCompleted,
      currentStreak: completed ? prev.currentStreak + 1 : prev.currentStreak
    }))
  }

  return { userProgress, updateProgress }
}

// Interactive Decision Game Component
function DecisionGame({ onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const scenarios = [
    {
      id: 1,
      situation: "You're at a party and someone offers you a drink that you suspect contains alcohol. Your friends are watching.",
      choices: [
        { 
          text: "Take the drink to fit in", 
          points: 0, 
          feedback: "While peer acceptance feels important, compromising your values can lead to bigger problems. Consider the long-term consequences.",
          consequence: "You feel uncomfortable and worried about the effects."
        },
        { 
          text: "Politely decline and suggest an alternative", 
          points: 10, 
          feedback: "Excellent choice! Suggesting alternatives shows leadership and helps others make better decisions too.",
          consequence: "Your friends respect your decision and some join you in choosing non-alcoholic options."
        },
        { 
          text: "Leave the party immediately", 
          points: 7, 
          feedback: "Removing yourself from the situation is valid, though finding ways to navigate these situations can be empowering.",
          consequence: "You avoid the immediate pressure but wonder how to handle similar situations in the future."
        }
      ]
    },
    {
      id: 2,
      situation: "A friend seems stressed about school and mentions they've been thinking about trying substances to cope. They ask for your advice.",
      choices: [
        { 
          text: "Suggest they should try it if it helps", 
          points: 0, 
          feedback: "Supporting harmful coping mechanisms can escalate problems. Friends need guidance toward healthy solutions.",
          consequence: "Your friend tries substances and their problems get worse, affecting their grades and relationships."
        },
        { 
          text: "Listen and suggest talking to a counselor or trusted adult", 
          points: 10, 
          feedback: "Perfect response! Showing empathy while directing them to professional help is exactly what good friends do.",
          consequence: "Your friend feels heard and gets the professional support they need to develop healthy coping strategies."
        },
        { 
          text: "Change the subject to avoid the conversation", 
          points: 2, 
          feedback: "While avoiding difficult topics is natural, friends in crisis need support and guidance.",
          consequence: "Your friend feels alone with their problems and may make poor decisions without guidance."
        }
      ]
    },
    {
      id: 3,
      situation: "You see posts on social media showing classmates using substances and seeming to have fun. You're feeling left out.",
      choices: [
        { 
          text: "Ask to join them next time", 
          points: 0, 
          feedback: "Social media often shows only highlights, not consequences. Real connections come from shared interests and values.",
          consequence: "You realize the 'fun' was temporary, but the risks and consequences are real and lasting."
        },
        { 
          text: "Focus on activities and friends that align with your values", 
          points: 10, 
          feedback: "Excellent insight! Authentic friendships are built on mutual respect and shared healthy interests.",
          consequence: "You develop deeper, more meaningful relationships and discover activities you truly enjoy."
        },
        { 
          text: "Feel bad about yourself and withdraw", 
          points: 3, 
          feedback: "It's normal to feel left out sometimes, but isolation isn't the answer. Seek positive connections instead.",
          consequence: "Withdrawing makes you feel worse. Consider reaching out to counselors or finding positive social groups."
        }
      ]
    }
  ]

  const handleChoice = (choiceIndex) => {
    setSelectedChoice(choiceIndex)
    setShowFeedback(true)
    const points = scenarios[currentScenario].choices[choiceIndex].points
    setScore(prev => prev + points)
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setSelectedChoice(null)
      setShowFeedback(false)
    } else {
      setGameComplete(true)
      onComplete('decision-game', score)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setScore(0)
    setGameComplete(false)
    setSelectedChoice(null)
    setShowFeedback(false)
  }

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-lg text-gray-600 mb-4">Your Score: {score}/{scenarios.length * 10}</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Key Takeaways:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Healthy decision-making involves considering long-term consequences</li>
              <li>• Supporting friends means guiding them toward professional help when needed</li>
              <li>• Authentic relationships are built on mutual respect and shared values</li>
              <li>• It's okay to remove yourself from uncomfortable situations</li>
            </ul>
          </div>
          <button 
            onClick={resetGame}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentScenario]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Scenario {currentScenario + 1} of {scenarios.length}</span>
          <span className="text-sm text-blue-600 font-medium">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Situation:</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{scenario.situation}</p>
      </div>

      {!showFeedback ? (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">What would you do?</h4>
          <div className="space-y-3">
            {scenario.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className={`p-4 rounded-lg mb-4 ${selectedChoice !== null && scenario.choices[selectedChoice].points >= 7 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <h4 className="font-medium mb-2">
              {selectedChoice !== null && scenario.choices[selectedChoice].points >= 7 ? 'Great Choice!' : 'Think About This:'}
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              {selectedChoice !== null && scenario.choices[selectedChoice].feedback}
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-600">
                <strong>What happens next:</strong> {selectedChoice !== null && scenario.choices[selectedChoice].consequence}
              </p>
            </div>
          </div>
          <button
            onClick={nextScenario}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>{currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Game'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// Peer Pressure Resistance Game
function PeerPressureGame({ onComplete }) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [responses, setResponses] = useState([])

  const pressureScenarios = [
    {
      pressure: "Come on, everyone's doing it. Don't be such a baby.",
      effectiveResponses: [
        "I'm comfortable with my decision.",
        "I don't need to prove anything to anyone.",
        "I'm good, thanks."
      ],
      ineffectiveResponses: [
        "Maybe you're right...",
        "I guess I am being a baby.",
        "Fine, I'll do it."
      ],
      tip: "Confident, brief responses work best. Don't over-explain or justify your decisions."
    },
    {
      pressure: "You're missing out on all the fun. Live a little!",
      effectiveResponses: [
        "I have fun in other ways.",
        "This isn't my idea of fun.",
        "I'm already living my best life."
      ],
      ineffectiveResponses: [
        "You're probably right about missing out.",
        "Maybe I should live a little more.",
        "I don't want to miss the fun."
      ],
      tip: "Redefine 'fun' and 'living' on your own terms. Your version of a good time is valid."
    },
    {
      pressure: "If you don't try it, how do you know you won't like it?",
      effectiveResponses: [
        "I don't need to try everything to know what's right for me.",
        "I already know this isn't for me.",
        "Some risks aren't worth taking."
      ],
      ineffectiveResponses: [
        "I guess I'll never know unless I try.",
        "You make a good point.",
        "Maybe I should be more open-minded."
      ],
      tip: "You don't have to experience everything to make informed decisions. Trust your judgment."
    }
  ]

  const handleResponse = (responseIndex, isEffective) => {
    const newResponse = {
      level: currentLevel,
      response: isEffective ? pressureScenarios[currentLevel].effectiveResponses[responseIndex] : pressureScenarios[currentLevel].ineffectiveResponses[responseIndex],
      effective: isEffective,
      points: isEffective ? 10 : 2
    }
    
    setResponses([...responses, newResponse])
    setScore(prev => prev + newResponse.points)

    if (currentLevel < pressureScenarios.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1)
      }, 2000)
    } else {
      setTimeout(() => {
        setGameComplete(true)
        onComplete('peer-pressure', score + newResponse.points)
      }, 2000)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setGameComplete(false)
    setResponses([])
  }

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resistance Training Complete!</h2>
          <p className="text-lg text-gray-600">Your Score: {score}/{pressureScenarios.length * 10}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-purple-900 mb-3">Your Responses:</h3>
          {responses.map((response, index) => (
            <div key={index} className={`p-2 mb-2 rounded ${response.effective ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm">"{response.response}"</span>
                <span className="text-xs font-medium">{response.points} pts</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Key Strategies:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep responses short and confident</li>
            <li>• Don't over-explain or justify your decisions</li>
            <li>• Redefine concepts like "fun" on your own terms</li>
            <li>• Trust your judgment - you don't need to try everything</li>
          </ul>
        </div>

        <button 
          onClick={resetGame}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Again</span>
        </button>
      </div>
    )
  }

  const currentScenario = pressureScenarios[currentLevel]
  const allResponses = [...currentScenario.effectiveResponses, ...currentScenario.ineffectiveResponses].sort(() => Math.random() - 0.5)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Level {currentLevel + 1} of {pressureScenarios.length}</span>
          <span className="text-sm text-purple-600 font-medium">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentLevel + 1) / pressureScenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-red-900 mb-2">Peer Pressure:</h3>
          <p className="text-red-800">"{currentScenario.pressure}"</p>
        </div>
        <p className="text-gray-600 text-sm mb-4">Choose the most effective response:</p>
      </div>

      <div className="space-y-3 mb-4">
        {allResponses.map((response, index) => {
          const isEffective = currentScenario.effectiveResponses.includes(response)
          const effectiveIndex = currentScenario.effectiveResponses.indexOf(response)
          const ineffectiveIndex = currentScenario.ineffectiveResponses.indexOf(response)
          
          return (
            <button
              key={index}
              onClick={() => handleResponse(
                isEffective ? effectiveIndex : ineffectiveIndex, 
                isEffective
              )}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              "{response}"
            </button>
          )
        })}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Strategy tip:</strong> {currentScenario.tip}
        </p>
      </div>
    </div>
  )
}

// Progress Dashboard Component
function ProgressDashboard({ userProgress }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Games Completed</p>
            <p className="text-2xl font-bold text-blue-600">{userProgress.gamesCompleted}</p>
          </div>
          <Gamepad2 className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Score</p>
            <p className="text-2xl font-bold text-green-600">{userProgress.totalScore}</p>
          </div>
          <Star className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-purple-600">{userProgress.currentStreak}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'games', label: 'Play Games', icon: Gamepad2, path: '/games' },
    { id: 'learn', label: 'Learn', icon: BookOpen, path: '/learn' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
    { id: 'help', label: 'Get Help', icon: HelpCircle, path: '/help' }
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-gray-900">
              SoberSteps
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 ml-8">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-gray-700"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

// Enhanced Games Page with Actual Playable Games
function GamesPage({ userProgress, updateProgress }) {
  const [currentGame, setCurrentGame] = useState(null)

  const handleGameComplete = (gameId, score) => {
    updateProgress(gameId, score, true)
    setTimeout(() => setCurrentGame(null), 3000) // Return to games list after 3 seconds
  }

  if (currentGame === 'decision-simulator') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentGame(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>Back to Games</span>
          </button>
          <DecisionGame onComplete={handleGameComplete} />
        </div>
      </div>
    )
  }

  if (currentGame === 'peer-pressure-challenge') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentGame(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>Back to Games</span>
          </button>
          <PeerPressureGame onComplete={handleGameComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Learning Games</h1>
          <p className="text-xl text-gray-600">Practice real-world skills in a safe environment</p>
        </div>
        
        <ProgressDashboard userProgress={userProgress} />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-xl">
              <Target className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white">Decision Simulator</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Navigate realistic peer pressure scenarios and learn effective decision-making strategies.</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Difficulty: Beginner</span>
                <span>Duration: 10-15 min</span>
              </div>
              <button 
                onClick={() => setCurrentGame('decision-simulator')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-xl">
              <Users className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white">Peer Pressure Challenge</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Practice responding to peer pressure with confidence and develop resistance skills.</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Difficulty: Intermediate</span>
                <span>Duration: 8-12 min</span>
              </div>
              <button 
                onClick={() => setCurrentGame('peer-pressure-challenge')}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Start Challenge
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-75">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-t-xl">
              <Heart className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white">Wellness Tracker</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Build healthy habits and track your mental and physical wellbeing journey.</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Difficulty: All Levels</span>
                <span>Duration: Ongoing</span>
              </div>
              <button 
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Home Page (simplified version)
function HomePage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Play. Learn.
              <br />
              <span className="text-indigo-600">
                Stay Strong.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Interactive educational games designed to build awareness, develop life skills, 
              and support healthy decision-making for young people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/games')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Playing</span>
              </button>
              <button 
                onClick={() => navigate('/learn')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Games Preview Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Evidence-Based Learning Games</h2>
            <p className="text-xl text-gray-600">Practice real-world scenarios in a safe environment</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Decision Simulator</h3>
              <p className="text-gray-600 mb-6">
                Navigate realistic peer pressure scenarios with immediate feedback. Based on cognitive-behavioral 
                principles, this game helps you practice decision-making skills before facing real situations.
              </p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Realistic peer pressure scenarios</li>
                <li>• Immediate consequences and feedback</li>
                <li>• Evidence-based resistance strategies</li>
                <li>• Skills transfer to real-world situations</li>
              </ul>
              <button 
                onClick={() => navigate('/games')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try It Now
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive Scenarios</h4>
                  <p className="text-sm text-gray-600">Practice makes perfect. Build confidence through repetition.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research-Based Evidence Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Interactive Learning Works</h2>
            <p className="text-xl text-gray-600">Backed by educational research and prevention science</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Smile className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">85% Better Retention</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive learning increases knowledge retention by 85% compared to passive instruction, 
                according to educational research studies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skill Transfer</h3>
              <p className="text-gray-600 leading-relaxed">
                Scenario-based learning helps students apply skills in real situations, 
                bridging the gap between knowledge and action.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Self-Efficacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice builds confidence. Students who engage with interactive scenarios 
                report higher self-efficacy in challenging situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Learn Page with Research Citations
function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState(null)

  const topics = [
    {
      id: 'peer-pressure',
      title: 'Understanding Peer Pressure',
      summary: 'Learn about different types of peer pressure and evidence-based resistance strategies.',
      readTime: '8 min read',
      content: {
        overview: 'Peer pressure is the influence exerted by peers to encourage someone to change their attitudes, values, or behaviors to conform to group norms.',
        types: [
          'Direct pressure: Explicit requests or demands to engage in specific behaviors',
          'Indirect pressure: Subtle social cues and expectations within peer groups',
          'Individual pressure: Internal desire to fit in or be accepted'
        ],
        strategies: [
          'The "Broken Record" technique: Calmly repeat your position without elaboration',
          'Suggest alternatives: Redirect the group toward different activities',
          'Use confident body language: Stand tall, make eye contact, speak clearly',
          'Find allies: Identify others who share your values'
        ],
        research: 'Studies show that resistance skills training can reduce substance use initiation by up to 40% (Botvin & Griffin, 2004).'
      }
    },
    {
      id: 'decision-making',
      title: 'Healthy Decision-Making Framework',
      summary: 'A step-by-step approach to making decisions that align with your values and goals.',
      readTime: '10 min read',
      content: {
        overview: 'Effective decision-making involves systematic evaluation of options, consequences, and personal values.',
        framework: [
          'STOP: Pause and recognize you have a choice to make',
          'THINK: Consider your options and their potential consequences',
          'EVALUATE: Weigh options against your personal values and goals',
          'DECIDE: Make a choice and commit to following through',
          'REFLECT: Learn from the outcomes of your decision'
        ],
        factors: [
          'Short-term vs. long-term consequences',
          'Impact on personal goals and relationships',
          'Alignment with personal values and beliefs',
          'Availability of support and resources'
        ],
        research: 'Research in developmental psychology shows that structured decision-making frameworks improve adolescent choice quality (Steinberg, 2013).'
      }
    },
    {
      id: 'stress-coping',
      title: 'Healthy Stress Management',
      summary: 'Evidence-based techniques for managing stress and difficult emotions without harmful substances.',
      readTime: '12 min read',
      content: {
        overview: 'Stress is a normal part of life, but how we cope with it significantly impacts our wellbeing and decision-making.',
        techniques: [
          'Deep breathing exercises: Activate the parasympathetic nervous system',
          'Progressive muscle relaxation: Systematically tension and release muscle groups',
          'Mindfulness meditation: Focus attention on present moment experiences',
          'Physical exercise: Release endorphins and reduce stress hormones',
          'Social support: Connect with trusted friends, family, or counselors'
        ],
        warning_signs: [
          'Persistent feelings of overwhelm or helplessness',
          'Changes in sleep patterns or appetite',
          'Withdrawal from activities or relationships',
          'Increased irritability or mood swings'
        ],
        research: 'Meta-analyses demonstrate that cognitive-behavioral stress management techniques reduce anxiety and improve coping skills in adolescents (Ames et al., 2011).'
      }
    }
  ]

  if (selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic)
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedTopic(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>Back to Topics</span>
          </button>
          
          <article className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{topic.title}</h1>
              <p className="text-gray-600">{topic.readTime}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">Overview</h2>
              <p className="text-blue-800">{topic.content.overview}</p>
            </div>

            {topic.content.types && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of {topic.title.split(' ')[1]}</h2>
                <ul className="space-y-2">
                  {topic.content.types.map((type, index) => (
                    <li key={index} className="text-gray-700">• {type}</li>
                  ))}
                </ul>
              </div>
            )}

            {topic.content.strategies && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Effective Strategies</h2>
                <ul className="space-y-3">
                  {topic.content.strategies.map((strategy, index) => (
                    <li key={index} className="text-gray-700">• {strategy}</li>
                  ))}
                </ul>
              </div>
            )}

            {topic.content.framework && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Decision-Making Framework</h2>
                <ol className="space-y-3">
                  {topic.content.framework.map((step, index) => (
                    <li key={index} className="text-gray-700">{index + 1}. {step}</li>
                  ))}
                </ol>
              </div>
            )}

            {topic.content.techniques && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Healthy Coping Techniques</h2>
                <ul className="space-y-3">
                  {topic.content.techniques.map((technique, index) => (
                    <li key={index} className="text-gray-700">• {technique}</li>
                  ))}
                </ul>
              </div>
            )}

            {topic.content.warning_signs && (
              <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-yellow-900 mb-4">When to Seek Additional Support</h2>
                <ul className="space-y-2">
                  {topic.content.warning_signs.map((sign, index) => (
                    <li key={index} className="text-yellow-800">• {sign}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Research Foundation</h2>
              <p className="text-gray-700 text-sm">{topic.content.research}</p>
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Evidence-Based Learning Resources</h1>
          <p className="text-xl text-gray-600">Research-backed information to support healthy decision-making</p>
        </div>
        
        <div className="space-y-6">
          {topics.map((topic) => (
            <div 
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 hover:border-blue-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{topic.title}</h3>
                <span className="text-sm text-gray-500">{topic.readTime}</span>
              </div>
              <p className="text-gray-600 mb-3">{topic.summary}</p>
              <div className="flex items-center text-blue-600 hover:text-blue-700">
                <span className="text-sm font-medium">Read Article</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Need Additional Support?</h2>
          <p className="text-blue-800 mb-4">
            If you're struggling with these topics or need someone to talk to, remember that seeking help is a sign of strength.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Find Support Resources
          </button>
        </div>
      </div>
    </div>
  )
}

// Other components remain the same (AboutPage, HelpPage, Footer)
function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SoberSteps</h1>
          <p className="text-xl text-gray-600">Evidence-based prevention education through interactive learning</p>
        </div>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-gray-700 mb-6">
            SoberSteps combines educational research, prevention science, and interactive technology 
            to help young people develop critical life skills and make informed decisions about their health and wellbeing.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Evidence-Based Approach</h2>
          <p className="text-gray-700 mb-6">
            Our content is grounded in peer-reviewed research from fields including developmental psychology, 
            prevention science, and educational technology. We partner with researchers and educators to ensure 
            our games and resources reflect current best practices in prevention education.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Research Foundations</h2>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• Social Learning Theory (Bandura, 1977)</li>
            <li>• Cognitive-Behavioral Prevention Models</li>
            <li>• Experiential Learning Theory (Kolb, 1984)</li>
            <li>• Self-Determination Theory (Deci & Ryan, 1985)</li>
            <li>• Risk and Protective Factors Framework</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• Interactive scenario-based learning with immediate feedback</li>
            <li>• Skills practice through gamified experiences</li>
            <li>• Progress tracking and achievement systems</li>
            <li>• Age-appropriate content based on developmental research</li>
            <li>• Integration with crisis support resources</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Help & Support</h1>
          <p className="text-xl text-gray-600">Professional resources and crisis support</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-4">Crisis Support</h3>
            <p className="text-red-800 mb-4">
              If you or someone you know is in immediate danger or crisis, please reach out:
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">National Suicide Prevention Lifeline</p>
                <p className="text-red-800">Call or text 988</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">Crisis Text Line</p>
                <p className="text-red-800">Text HOME to 741741</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">Emergency Services</p>
                <p className="text-red-800">Call 911</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Substance Abuse Resources</h3>
            <p className="text-blue-800 mb-4">
              Professional support for substance-related concerns:
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">SAMHSA National Helpline</p>
                <p className="text-blue-800">1-800-662-HELP (4357)</p>
                <p className="text-xs text-blue-700">Free, confidential, 24/7 treatment referral service</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">National Suicide Prevention Lifeline</p>
                <p className="text-blue-800">findtreatment.samhsa.gov</p>
                <p className="text-xs text-blue-700">Online treatment locator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">When to Seek Professional Help</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Warning Signs:</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Persistent feelings of sadness or hopelessness</li>
                <li>• Significant changes in behavior or personality</li>
                <li>• Withdrawal from friends, family, or activities</li>
                <li>• Declining academic or work performance</li>
                <li>• Increased risk-taking behaviors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Types of Professional Support:</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• School counselors and social workers</li>
                <li>• Licensed therapists and psychologists</li>
                <li>• Substance abuse counselors</li>
                <li>• Support groups and peer programs</li>
                <li>• Medical professionals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SoberSteps</h3>
            <p className="text-gray-400 text-sm">
              Evidence-based prevention education through interactive learning experiences.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link to="/games" className="block text-gray-400 hover:text-white transition-colors">Interactive Games</Link>
              <Link to="/learn" className="block text-gray-400 hover:text-white transition-colors">Learning Articles</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">Research Citations</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="space-y-2 text-sm">
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors">Crisis Resources</Link>
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors">Professional Help</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 SoberSteps. All rights reserved. This platform provides educational content only and is not a substitute for professional medical or psychological advice.</p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const { userProgress, updateProgress } = useGameState()

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage userProgress={userProgress} updateProgress={updateProgress} />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App